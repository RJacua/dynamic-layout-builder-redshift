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

  setPanning(bool: boolean){
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

  emitFullViewFlag(){
    this.fullViewFlag.set(true);
    setTimeout(() => this.fullViewFlag.set(false), 0);
  }

  emitFitViewFlag(){
    this.fitViewFlag.set(true);
    setTimeout(() => this.fitViewFlag.set(false), 0);
  }

}
