import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
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

  readonly modelSvc = inject(ModelService);

  private _selectedId = signal<string>('canvas');
  
  isPanning = signal(false);
  selectedElementId = computed(!this.isPanning() ? this._selectedId : signal('canvas'));
  selectedNode = computed(() => this.modelSvc.getNodeById(this.selectedElementId(), this.modelSvc.canvasModel()));

  height = signal(0);
  width = signal(0);

  select(element: ContainerData | AtomicElementData): void {
    if (this.isPanning()) {
      this.unselect()
      return
    }

    if (element.type === 'canvas') {
      this.unselect();
      return
    }
    else if (element.id) {
      this.unselect();
      setTimeout(() => this._selectedId.set(element.id), 0);
    }
  }

  selectById(id: string, keep = false) {
    if (this.isPanning()) {
      this.unselect()
      return
    }

    if (id !== this._selectedId()) {
      this._selectedId.set(id);
    }
    else if (!keep) this.unselect();
  }

  unselect() {
    // console.log('unselect');
    this._selectedId.set('canvas');
  }

  private _hoveredId = signal<string>('canvas');
  hoveredElementId = computed(!this.isPanning() ? this._hoveredId : signal('canvas'));
  hoveredNode = computed(() => this.modelSvc.getNodeById(this.hoveredElementId(), this.modelSvc.canvasModel()));

  hover(element: ContainerData | AtomicElementData): void {
    if (this.isPanning()) {
      this.unhover()
      return
    }
    if (element.type === 'canvas') {
      this.unhover();
      return
    }
    else if (element.id) {
      this._hoveredId.set(element.id);
    }
  }

  hoverById(id: string) {
    if (this.isPanning()) {
      this.unhover()
      return
    }
    this._hoveredId.set(id);
  }

  unhover() {
    this._hoveredId.set('canvas');
  }

  // findDeepestElementByDataIdAndTag(
  //   id: string
  // ) {
  //   console.log("entrou");
  //   const tagName = this.selectedNode().data.type === 'container' ? 'div' : this.selectedNode().data.type;
  //   const allMatches = document.querySelectorAll<HTMLElement>(`${tagName}[data-id="${id}"]`);
  //   if (allMatches.length === 0) {console.log('foinull'); return;}

  //   let filtered = Array.from(allMatches);
  //   filtered = filtered.filter((el) => !el.className.includes('tree-node'));

  //   console.log(filtered)

  //   // Ordena do mais interno (maior profundidade) para o mais externo
  //   const sorted = filtered.sort((a, b) => {
  //     return this.getDepth(b) - this.getDepth(a);
  //   });

  //   console.log(sorted[0]);

  //   return sorted[0];
  // }

  // getDepth(el: HTMLElement): number {
  //   let depth = 0;
  //   let current: HTMLElement | null = el;
  //   while (current?.parentElement) {
  //     depth++;
  //     current = current.parentElement;
  //   }
  //   return depth;
  // }

}