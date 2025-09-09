// banner.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';

export type BannerVariant = 'info' | 'error' | 'warning' | 'success';

export interface BannerAction {
  id: string;
  label: string;
  kind?: 'primary' | 'danger' | 'default';
}

export interface BannerPayload {
  id: number;
  message: string;
  actions: BannerAction[];
  variant: BannerVariant;
  autoHideMs?: number;
  _resolve?: (result: string | null) => void;
}

@Injectable({ providedIn: 'root' })
export class BannerService {
  current: WritableSignal<BannerPayload | null> = signal<BannerPayload | null>(null);

  show(opts: {
    message: string;
    actions?: BannerAction[];
    variant?: BannerVariant;
    autoHideMs?: number;
  }): Promise<string | null> {
    const payload: BannerPayload = {
      id: Date.now(),
      message: opts.message,
      actions: opts.actions?.length
        ? opts.actions
        : [{ id: 'ok', label: 'OK', kind: 'primary' }],
      variant: opts.variant ?? 'info',
      autoHideMs: opts.autoHideMs,
    };

    return new Promise<string | null>((resolve) => {
      payload._resolve = resolve;
      this.current.set(payload);

      if (payload.autoHideMs && payload.actions.length === 1) {
        const id = payload.id;
        setTimeout(() => {
          if (this.current()?.id === id) {
            this.close(null);
          }
        }, payload.autoHideMs);
      }
    });
  }

  choose(actionId: string) {
    const cur = this.current();
    if (!cur) return;
    cur._resolve?.(actionId);
    this.current.set(null);
  }

  /** Usado pelo componente após o fade-out */
  close(result: string | null = null) {
    const cur = this.current();
    if (!cur) return;
    cur._resolve?.(result);
    this.current.set(null);
  }
}
