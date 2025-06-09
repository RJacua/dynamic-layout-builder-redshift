import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AtomicElementData, ContainerData, LayoutElement } from '../interfaces/layout-elements';
import { ModelService } from './model.service';

//Criar selectedNode que vai ser passado pras coisas do style
//Em cada style fazer o update do Canvas Model grande, isso vai atualizar o seçected node...
//Garantir reatividade, acho q precisa de effect e untracked pra evitar loop infinito

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  readonly modelSvc = inject(ModelService);

  private _selectedId = signal<string>('canvas');

  selectedElementId = computed(this._selectedId);
  selectedNode = computed(() => this.modelSvc.getNodeById(this.selectedElementId(), this.modelSvc.canvasModel()));

  isPanning = signal(false);

  select(element: ContainerData | AtomicElementData): void {
    if (element.type === 'canvas') {
      this.unselect();
      return
    }
    else if (element.id) {
      this._selectedId.set(element.id);
    }
  }

  selectById(id: string, keep = false) {
    if (id !== this._selectedId()) {
      this._selectedId.set(id);
    }
    else if (!keep) this.unselect();
  }

  unselect() {
    this._selectedId.set('canvas');
  }

  private _hoveredId = signal<string>('canvas');
  hoveredElementId = computed(this._hoveredId);
  hoveredNode = computed(() => this.modelSvc.getNodeById(this.hoveredElementId(), this.modelSvc.canvasModel()));

  hover(element: ContainerData | AtomicElementData): void {
    if (element.type === 'canvas') {
      this.unhover();
      return
    }
    else if (element.id) {
      this._hoveredId.set(element.id);
    }
  }

  hoverById(id: string) {
    this._hoveredId.set(id);
  }

  unhover() {
    this._hoveredId.set('canvas');
  }

  findDeepestElementByDataIdAndTag(
    dataId: string,
    tagName: string
  ): HTMLElement | null {
    console.log("entrou");
    const allMatches = document.querySelectorAll<HTMLElement>(`${tagName}[data-id="${dataId}"]`);
    if (allMatches.length === 0) return null

    // Ordena do mais interno (maior profundidade) para o mais externo
    const sorted = Array.from(allMatches).sort((a, b) => {
      return this.getDepth(b) - this.getDepth(a);
    });

    console.log(sorted[0]);

    return sorted[0];
  }

  getDepth(el: HTMLElement): number {
    let depth = 0;
    let current: HTMLElement | null = el;
    while (current?.parentElement) {
      depth++;
      current = current.parentElement;
    }
    return depth;
  }


}