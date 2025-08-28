import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanningService {

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

  constructor() { }

  setPanning(bool: boolean) {
    this.isPanning.set(bool);
  }
  togglePanning() {
    this.isPanning.update(() => !this.isPanning());
  }

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

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth <= 0 || contentHeight <= 0) return;

    // Escala proporcional
    const scaleX = (viewportWidth / contentWidth);
    const scaleY = (viewportHeight / contentHeight);
    const scale = Math.min(scaleX, scaleY, this.maxScale());
    this.scale.set(scale);

    // 👇 X pode resetar (ancorar na esquerda funciona)
    this.translateX.set(0);

    // 👇 Y precisa compensar para centralizar verticalmente
    const viewportCenterY = viewportHeight * scale / 2;
    const contentCenterY = (minY + contentHeight / 2) * scale;
    this.translateY.set(viewportCenterY - contentCenterY);
  }

}
