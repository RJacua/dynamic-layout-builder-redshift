import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PanningService {
  // estado de panning + navegação
  isPanning = signal(false);
  startX = signal(0);
  startY = signal(0);
  scrollLeft = signal(0);
  scrollTop = signal(0);
  translateX = signal(0);
  translateY = signal(0);
  scale = signal(1);
  lastX = signal(0);
  lastY = signal(0);
  offsetX = signal(0);
  offsetY = signal(0);
  minScale = signal(0.3);
  maxScale = signal(3);
  fullViewFlag = signal(false);
  fitViewFlag = signal(false);

  // --- atalhos de teclado (Space) ---
  private keydownHandler?: (e: KeyboardEvent) => void;
  private keyupHandler?: (e: KeyboardEvent) => void;
  private blurHandler?: () => void;
  private readonly useCapture = true;

  constructor() {}

  /** Chame UMA vez (ex.: no ngOnInit do Workspace) */
  initKeyboardShortcuts() {
    if (this.keydownHandler) return; // já inicializado

    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;

      // se estiver digitando (inputs/textareas/contentEditable), não faz pan
      if (this.isTypingTarget(e.target as HTMLElement)) return;

      // impede que Space "clique" no botão focado
      e.preventDefault();
      e.stopPropagation();

      // se há um elemento ativável focado, remova o foco
      const ae = document.activeElement as HTMLElement | null;
      if (ae && this.isActivatable(ae)) {
        ae.blur();
      }

      if (!this.isPanning()) this.isPanning.set(true);
    };

    this.keyupHandler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      // evita efeito colateral em alguns browsers
      e.preventDefault();
      e.stopPropagation();
      if (this.isPanning()) this.isPanning.set(false);
    };

    this.blurHandler = () => this.isPanning.set(false);

    window.addEventListener('keydown', this.keydownHandler, { capture: this.useCapture });
    window.addEventListener('keyup',   this.keyupHandler,   { capture: this.useCapture });
    window.addEventListener('blur',    this.blurHandler!);
  }

  /** Chame no ngOnDestroy do host que inicializou */
  destroyKeyboardShortcuts() {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler, { capture: this.useCapture } as any);
      this.keydownHandler = undefined;
    }
    if (this.keyupHandler) {
      window.removeEventListener('keyup', this.keyupHandler, { capture: this.useCapture } as any);
      this.keyupHandler = undefined;
    }
    if (this.blurHandler) {
      window.removeEventListener('blur', this.blurHandler);
      this.blurHandler = undefined;
    }
  }

  private isTypingTarget(el: HTMLElement | null): boolean {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  private isActivatable(el: HTMLElement): boolean {
    const tag = el.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return true;
    const role = el.getAttribute('role');
    return role === 'button' || role === 'menuitem' || role === 'tab';
  }

  // ---------- API existente ----------
  setPanning(bool: boolean) { this.isPanning.set(bool); }
  togglePanning() { this.isPanning.update(v => !v); }

  fullView() {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  emitFullViewFlag() {
    this.fullViewFlag.set(true);
    setTimeout(() => this.fullViewFlag.set(false), 0);
  }

  emitFitViewFlag() {
    this.fitViewFlag.set(true);
    setTimeout(() => this.fitViewFlag.set(false), 0);
  }

  fitView(viewportEl: HTMLElement, coreEl: HTMLElement) {
    const viewportWidth = viewportEl.clientWidth;
    const viewportHeight = viewportEl.clientHeight;

    const containers = Array.from(coreEl.querySelectorAll('app-container')) as HTMLElement[];
    if (containers.length === 0) return;

    let minY = Infinity, maxY = -Infinity;
    let minX = Infinity, maxX = -Infinity;

    containers.forEach(c => {
      const x = c.offsetLeft;
      const y = c.offsetTop;
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + w);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + h);
    });

    const contentWidth  = maxX - minX;
    const contentHeight = maxY - minY;
    if (contentWidth <= 0 || contentHeight <= 0) return;

    const scaleX = viewportWidth  / contentWidth;
    const scaleY = viewportHeight / contentHeight;
    const scale  = Math.min(scaleX, scaleY, this.maxScale());
    this.scale.set(scale);

    this.translateX.set(0);

    const viewportCenterY = viewportHeight * scale / 2;
    const contentCenterY  = (minY + contentHeight / 2) * scale;
    this.translateY.set(viewportCenterY - contentCenterY);
  }
}
