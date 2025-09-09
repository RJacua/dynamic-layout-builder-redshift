import { ElementRef, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowRescaleService {

  scale = signal(1);
  baseX = signal(0);
  baseY = signal(0);
  spacerW = signal(0);
  spacerH = signal(0);
  viewW = signal(0);
  viewH = signal(0);
  worldW = signal(0);
  worldH = signal(0);

  private sizedEditViewport = false;

  private dprMql?: MediaQueryList;
  private dprListener?: (e: MediaQueryListEvent) => void;

  reflow(editMode: boolean, viewportRef: ElementRef, coreRef: ElementRef, contentRootRef: ElementRef) {
    if (editMode) {
      this.ensureViewportForEdit(viewportRef);
      this.fitEditNoScroll(viewportRef, coreRef, contentRootRef);
    } else {
      this.clearViewportSizeForPreview(viewportRef);
      this.fitPreviewWithScroll(viewportRef, contentRootRef, coreRef);
    }
  }

  private fitPreviewWithScroll(viewportRef: ElementRef, contentRootRef: ElementRef, coreRef: ElementRef) {
    const vpRect = viewportRef.nativeElement.getBoundingClientRect();
    const { x, y, w, h } = this.measureContentLogical(contentRootRef, coreRef);

    const s = w > 0 ? (vpRect.width / w) : 1;
    this.scale.set(s);

    this.baseX.set(-s * x);
    this.baseY.set(-s * y);

    const scaledW = s * w;
    const scaledH = s * h;

    this.viewW.set(vpRect.width);
    this.viewH.set(vpRect.height);
    this.worldW.set(scaledW);
    this.worldH.set(scaledH);

    this.spacerW.set(vpRect.width);
    this.spacerH.set(Math.ceil(scaledH));

    const vpEl = viewportRef.nativeElement;
    requestAnimationFrame(() => {
      const maxScrollTop = Math.max(0, this.spacerH() - vpEl.clientHeight);
      if (vpEl.scrollTop > maxScrollTop) vpEl.scrollTop = maxScrollTop;
    });
  }

  private fitEditNoScroll(viewportRef: ElementRef, coreRef: ElementRef, contentRootRef: ElementRef) {
    const vpRect = viewportRef.nativeElement.getBoundingClientRect();
    const { x, y, w, h } = this.measureContentLogical(contentRootRef, coreRef);

    const s = w > 0 ? (vpRect.width / w) : 1;
    this.scale.set(s);

    this.baseX.set(-s * x);
    this.baseY.set(-s * y);

    const scaledW = s * w;
    const scaledH = s * h;

    this.viewW.set(vpRect.width);
    this.viewH.set(vpRect.height);
    this.worldW.set(Math.ceil(scaledW));
    this.worldH.set(Math.ceil(scaledH));

    this.spacerW.set(0);
    this.spacerH.set(0);
  }

  // estado interno para aplicar apenas 1x
  private editViewportArmed = false;

  private ensureViewportForEdit(viewportRef: ElementRef) {
    const vp = viewportRef?.nativeElement as HTMLElement;
    if (!vp) return;

    // Aplique só uma vez para evitar reflows desnecessários
    if (!this.editViewportArmed) {
      // NÃO defina height/width numéricas aqui.
      // Absolutiza o viewport dentro do container para não crescer com o conteúdo:
      vp.style.position = 'absolute';
      // cobre todo o container
      (vp.style as any).inset = '0'; // equivalente a top/right/bottom/left = 0
      vp.style.top = '0';
      vp.style.right = '0';
      vp.style.bottom = '0';
      vp.style.left = '0';

      // edit mode usa overflow: visible (já está no seu SCSS com !important)
      // não tocar em overflow aqui para não brigar com o template/CSS.

      this.editViewportArmed = true;
    }
  }

  private clearViewportSizeForPreview(viewportRef: ElementRef) {
    const vp = viewportRef?.nativeElement as HTMLElement;
    if (!vp) return;

    // desfaz o absolutizado para o preview se comportar como antes
    vp.style.position = '';
    (vp.style as any).inset = '';
    vp.style.top = '';
    vp.style.right = '';
    vp.style.bottom = '';
    vp.style.left = '';

    vp.style.height = '';
    vp.style.width = '';
    vp.style.overflow = 'auto'; // preview com scroll

    this.editViewportArmed = false;
  }


  setupDprListener(cb: () => void) {
    try {
      if (this.dprMql && this.dprListener) {
        this.dprMql.removeEventListener('change', this.dprListener);
      }
      this.dprMql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.dprListener = () => {
        this.setupDprListener(cb);
        cb();
      };
      this.dprMql.addEventListener('change', this.dprListener);
    } catch { }
  }

  private measureContentLogical(contentRootRef: ElementRef, coreRef: ElementRef): { x: number; y: number; w: number; h: number } {
    const root = contentRootRef?.nativeElement as HTMLElement | undefined;
    const core = coreRef?.nativeElement as HTMLElement | undefined;
    if (!root || !core) return { x: 0, y: 0, w: 1920, h: 1080 };

    const w1 = root.scrollWidth;
    const h1 = root.scrollHeight;
    if (w1 > 0 && h1 > 0) return { x: 0, y: 0, w: w1, h: h1 };

    const sNow = this.readCurrentScale(core);
    const coreRect = core.getBoundingClientRect();

    let minL = Number.POSITIVE_INFINITY, minT = Number.POSITIVE_INFINITY;
    let maxR = Number.NEGATIVE_INFINITY, maxB = Number.NEGATIVE_INFINITY;

    const children = Array.from(root.children) as HTMLElement[];
    if (children.length === 0) {
      return { x: 0, y: 0, w: 1920, h: 1080 };
    }

    for (const child of children) {
      const r = child.getBoundingClientRect();
      const l = (r.left - coreRect.left) / sNow;
      const t = (r.top - coreRect.top) / sNow;
      const rr = (r.right - coreRect.left) / sNow;
      const bb = (r.bottom - coreRect.top) / sNow;
      minL = Math.min(minL, l);
      minT = Math.min(minT, t);
      maxR = Math.max(maxR, rr);
      maxB = Math.max(maxB, bb);
    }

    const w = Math.max(0, maxR - minL);
    const h = Math.max(0, maxB - minT);
    return { x: minL, y: minT, w: w || 1920, h: h || 1080 };
  }
  private readCurrentScale(core: HTMLElement): number {
    const t = getComputedStyle(core).transform;
    if (!t || t === 'none') return 1;
    const m = t.match(/matrix\(([^)]+)\)/);
    if (!m) return 1;
    const parts = m[1].split(',').map(v => parseFloat(v));
    const a = parts[0];
    const d = parts[3];
    const sx = isFinite(a) ? Math.abs(a) : 1;
    const sy = isFinite(d) ? Math.abs(d) : sx;
    return (sx + sy) / 2;
  }
}
