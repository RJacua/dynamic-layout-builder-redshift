import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService, BannerPayload } from '../../services/banner.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {
  private bannerSvc = inject(BannerService);

  @Input() config!: BannerPayload;
  visible = false;
  hiding = false;

  @ViewChild('bannerRoot', { static: true }) bannerRoot!: ElementRef<HTMLElement>;
  @ViewChildren('actionBtn') actionBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  private keyHandler?: (e: KeyboardEvent) => void;

  ngOnInit() {
    // Fade-in
    setTimeout(() => (this.visible = true), 50);

    // Auto-hide com fade-out
    if (this.config.autoHideMs) {
      setTimeout(() => this.hide(), this.config.autoHideMs);
    }

    // captura Enter/Escape enquanto o banner estiver visível
    this.keyHandler = (e: KeyboardEvent) => {
      // só reage se o banner ainda estiver montado/visível
      if (!this.visible || !this.config) return;

      // se usuário está digitando num input/textarea, não intercepta
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.triggerDefaultAction();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.triggerCancelOrClose();
      }
    };

    window.addEventListener('keydown', this.keyHandler, { capture: true });
  }

  ngAfterViewInit() {
    // foca o botão padrão (ou o primeiro) quando o banner ficar visível
    setTimeout(() => {
      const idx = this.getDefaultIndex();
      const btn = this.actionBtns?.get(idx)?.nativeElement;
      if (btn) {
        btn.focus();
      } else {
        // fallback: foca o root para capturar Enter/Esc
        this.bannerRoot?.nativeElement.focus({ preventScroll: true });
      }
    }, 0);
  }

  ngOnDestroy() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler, { capture: true } as any);
      this.keyHandler = undefined;
    }
  }

  hide() {
    if (this.hiding) return;
    this.hiding = true;
    this.visible = false;
    setTimeout(() => {
      this.bannerSvc.close(null);
    }, 600); // tempo do fade
  }

  onAction(id: string) {
    if (this.config._resolve) {
      this.config._resolve(id);
    }
    this.hide();
  }

  // ---------- helpers de foco/teclas ----------
  private getDefaultIndex(): number {
    const actions = this.config?.actions ?? [];
    if (!actions.length) return 0;
    const primaryIdx = actions.findIndex(a => a.kind === 'primary');
    if (primaryIdx >= 0) return primaryIdx;
    const dangerIdx = actions.findIndex(a => a.kind === 'danger');
    if (dangerIdx >= 0) return dangerIdx;
    return 0;
  }

  private triggerDefaultAction() {
    const actions = this.config?.actions ?? [];
    if (!actions.length) {
      this.hide();
      return;
    }
    const idx = this.getDefaultIndex();
    const action = actions[idx];
    if (action) this.onAction(action.id);
  }

  private triggerCancelOrClose() {
    const actions = this.config?.actions ?? [];
    // se existir um botão "cancel" explícito, use-o; caso contrário, feche silenciosamente
    const cancelIdx = actions.findIndex(a => a.id.toLowerCase() === 'cancel' || a.id.toLowerCase() === 'cancelar');
    if (cancelIdx >= 0) {
      this.onAction(actions[cancelIdx].id);
    } else {
      this.hide(); // close(null)
    }
  }
}
