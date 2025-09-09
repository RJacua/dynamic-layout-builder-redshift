import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { AtomicElementData, ContainerData, LayoutElement, PointerResult } from '../interfaces/layout-elements';

type DragContext = 'tree' | 'canvas';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  constructor() { }

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  dragContext = signal<DragContext>('canvas');   // modo padrão
  hoveredRowId = signal<string | null>(null);    // usado só na árvore

  private lastDecision = { target: '', index: 0 };
  private rafToken: number | null = null;


  isDragging = signal(false);

  hoveredElementId = this.selectionSvc.hoveredElementId;
  hoveredNode = this.selectionSvc.hoveredNode;

  lastPointerX: number = 0;
  lastPointerY: number = 0;

  dropIndex = signal(-1);



  pointerInsideRelativePosition: WritableSignal<PointerResult> = signal({ bottom: false, left: false, right: false, top: false });
  pointerOutRelativePosition: WritableSignal<PointerResult> = signal({ bottom: false, left: false, right: false, top: false });

  private dropTarget: string | null = null;

  setCurrentDropTarget(id: string) {
    this.dropTarget = id;
  }

  getCurrentDropTarget(): string | null {
    return this.dropTarget;
  }

  clearDropTarget() {
    this.dropTarget = null;
  }

  // getPointerInternalPosition(
  //   el: HTMLElement,
  //   pointerX: number,
  //   pointerY: number,
  //   parentAlignment: string,
  // ): PointerResult {
  //   const rect = el.getBoundingClientRect();

  //   const halfwayY = rect.top + rect.height / 2;
  //   const halfwayX = rect.left + rect.width / 2;

  //   const topInnerBoundary = rect.top + 20;
  //   const bottomInnerBoundary = rect.bottom - 20;
  //   const leftInnerBoundary = rect.left + 20;
  //   const rightInnerBoundary = rect.right - 20;

  //   let centerX = false;
  //   let centerY = false;

  //   if (parentAlignment == 'column') {
  //     centerY = (pointerY > topInnerBoundary) && (pointerY < bottomInnerBoundary);
  //   }
  //   else if (parentAlignment == 'row') {
  //     centerX = (pointerX > leftInnerBoundary) && (pointerX < rightInnerBoundary);
  //   }

  //   return {
  //     top: pointerY < halfwayY,
  //     bottom: pointerY >= halfwayY,
  //     left: pointerX < halfwayX,
  //     right: pointerX >= halfwayX,
  //     center: centerX || centerY
  //   };
  // }

  // onDragMoved(event: CdkDragMove<any>) {
  //   this.lastPointerX = event.pointerPosition.x;
  //   this.lastPointerY = event.pointerPosition.y;

  //   this.dropTarget = this.hoveredElementId();

  //   let el = document.elementFromPoint(this.lastPointerX, this.lastPointerY) as HTMLElement;

  //   while (el && !el.hasAttribute('data-id') && el.parentElement) {
  //     el = el.parentElement;
  //   }

  //   if (this.hoveredNode().data) {


  //     const id = el.getAttribute('data-id') ?? 'canvas';

  //     let dropListItems;
  //     let parent = this.modelSvc.getNodeById(this.hoveredNode().data.parentId) ?? this.modelSvc.canvas();
  //     let parentAlign = 'column';

  //     if (!this.pointerInsideRelativePosition().center) {
  //       this.dropTarget = parent.data.id;
  //     }

  //     if (this.hoveredNode().data.type !== 'container') {
  //       dropListItems = parent.data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
  //       parentAlign = parent.data.style["flex-direction"];

  //       this.dropIndex.set(dropListItems.findIndex((item: LayoutElement<any>) => item.data.id === id) + 1);

  //       if ((parentAlign === 'column' && this.pointerInsideRelativePosition().top) || (parentAlign === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
  //         this.dropIndex.update(() => this.dropIndex() - 1);
  //       }
  //     }
  //     else {
  //       if (this.pointerInsideRelativePosition().center) {

  //         dropListItems = this.hoveredNode().data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
  //         if ((this.hoveredNode().data.style["flex-direction"] === 'column' && this.pointerInsideRelativePosition().top) || (this.hoveredNode().data.style["flex-direction"] === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
  //           this.dropIndex.set(0);
  //         }
  //         else this.dropIndex.set(-1);
  //       }
  //       else {
  //         parentAlign = parent.data.style["flex-direction"];
  //         dropListItems = parent.data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
  //         this.dropIndex.set(dropListItems.findIndex((item: LayoutElement<any>) => item.data.id === id) + 1);
  //         if ((parentAlign === 'column' && this.pointerInsideRelativePosition().top) || (parentAlign === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
  //           this.dropIndex.update(() => this.dropIndex() - 1);
  //         }
  //       }
  //     }

  //     const relativePosition = this.getPointerInternalPosition(
  //       el,
  //       this.lastPointerX,
  //       this.lastPointerY,
  //       parentAlign
  //     );

  //     this.pointerInsideRelativePosition.set(relativePosition);
  //   }
  // }

  private findRowAtPointer(x: number, y: number) {
    let el = document.elementFromPoint(x, y) as HTMLElement | null;
    while (el && !el.classList?.contains('node-line') && el.parentElement) el = el.parentElement;
    const id = el?.getAttribute('data-id') ?? null;
    return { row: el, id };
  }

  private findCanvasTargetAtPointer(x: number, y: number) {
    let el = document.elementFromPoint(x, y) as HTMLElement | null;
    while (el && !el.hasAttribute('data-id') && el.parentElement) el = el.parentElement;
    const id = el?.getAttribute('data-id') ?? 'canvas';
    return { el, id };
  }


  getPointerInternalPosition(
    el: HTMLElement,
    pointerX: number,
    pointerY: number,
    parentAlignment: string,
  ): PointerResult {
    const rect = el.getBoundingClientRect();

    const halfwayY = rect.top + rect.height / 2;
    const halfwayX = rect.left + rect.width / 2;

    // margem interna proporcional (evita flicker em linhas muito pequenas)
    const padY = Math.min(18, rect.height * 0.25);
    const padX = Math.min(18, rect.width * 0.25);

    const topInnerBoundary = rect.top + padY;
    const bottomInnerBoundary = rect.bottom - padY;
    const leftInnerBoundary = rect.left + padX;
    const rightInnerBoundary = rect.right - padX;

    let centerX = false;
    let centerY = false;

    if (parentAlignment === 'column') {
      centerY = pointerY > topInnerBoundary && pointerY < bottomInnerBoundary;
    } else if (parentAlignment === 'row') {
      // CORREÇÃO: comparação na ordem certa
      centerX = pointerX > leftInnerBoundary && pointerX < rightInnerBoundary;
    }

    return {
      top: pointerY < halfwayY,
      bottom: pointerY >= halfwayY,
      left: pointerX < halfwayX,
      right: pointerX >= halfwayX,
      center: centerX || centerY
    };
  }

  onDragMoved(event: CdkDragMove<any>) {
    this.lastPointerX = event.pointerPosition.x;
    this.lastPointerY = event.pointerPosition.y;

    if (this.dragContext() === 'tree') {
      // ---- TREE FLOW ----
      const hit = this.findRowAtPointer(this.lastPointerX, this.lastPointerY);
      const rowEl = hit.row;
      const hoveredId = hit.id ?? 'canvas';
      this.hoveredRowId.set(hoveredId);

      const hoveredNode = this.modelSvc.getNodeById(hoveredId) ?? this.modelSvc.canvas();
      const parent =
        hoveredId === 'canvas'
          ? this.modelSvc.canvas()
          : this.modelSvc.getNodeById(hoveredNode.data.parentId) ?? this.modelSvc.canvas();

      const parentAlign = (parent.data.style?.['flex-direction'] as string) || 'column';
      const isColumn = parentAlign !== 'row';

      const rp = this.getPointerInternalPosition(
        rowEl ?? document.body, this.lastPointerX, this.lastPointerY, parentAlign
      );
      this.pointerInsideRelativePosition.set(rp);

      const draggedId = this.selectionSvc.selectedElementId();
      let target = '';
      let index = -1;

      if (hoveredNode.data.type === 'container' && rp.center) {
        target = hoveredId;
        index = -1; // append dentro
      } else {
        const siblings = (parent.data.children ?? []).filter((el: any) => el.data.id !== draggedId);
        let hoveredIdx = siblings.findIndex((it: any) => it.data.id === hoveredId);
        if (hoveredIdx < 0) hoveredIdx = siblings.length - 1;
        index = ((isColumn && rp.bottom) || (!isColumn && rp.right)) ? hoveredIdx + 1 : hoveredIdx;
        target = parent.data.id;
      }

      this.setCurrentDropTarget(target);
      this.dropIndex.set(index);
      return;
    }

    // ---- CANVAS FLOW ----
    const hit = this.findCanvasTargetAtPointer(this.lastPointerX, this.lastPointerY);
    const el = hit.el ?? document.body;
    const hoveredId = hit.id;

    // manter hover atualizado no canvas
    this.selectionSvc.hoverById(hoveredId);

    const hoveredNode = this.modelSvc.getNodeById(hoveredId) ?? this.modelSvc.canvas();
    const parent =
      hoveredId === 'canvas'
        ? this.modelSvc.canvas()
        : this.modelSvc.getNodeById(hoveredNode.data.parentId) ?? this.modelSvc.canvas();

    let parentAlign = (parent.data.style?.['flex-direction'] as string) || 'column';
    const rp = this.getPointerInternalPosition(el, this.lastPointerX, this.lastPointerY, parentAlign);
    this.pointerInsideRelativePosition.set(rp);

    // tua lógica original para calcular alvo/índice no canvas
    const draggedId = this.selectionSvc.selectedElementId();
    let target = '';
    let index = -1;

    if (hoveredNode.data.type === 'container' && rp.center) {
      target = hoveredId;
      index = -1; // append
    } else {
      const siblings = (parent.data.children ?? []).filter((it: any) => it.data.id !== draggedId);
      let idx = siblings.findIndex((it: any) => it.data.id === hoveredId);
      if (idx < 0) idx = siblings.length;

      if ((parentAlign === 'column' && rp.bottom) || (parentAlign === 'row' && rp.right)) {
        idx += 1; // depois
      }
      target = parent.data.id;
      index = idx;
    }

    this.setCurrentDropTarget(target);
    this.dropIndex.set(index);
  }

  onDrop(event: CdkDragDrop<any>) {
    this.isDragging.set(false);

    const target = this.getCurrentDropTarget();
    const index = this.dropIndex();

    if (!target) return;
    if (!('children' in this.selectionSvc.selectedNode().data) && target === 'canvas') return;

    this.modelSvc.moveNodeTo(this.selectionSvc.selectedElementId(), target, index);

    // reset
    this.clearDropTarget();
    this.dropIndex.set(-1);
    this.hoveredRowId.set(null);
    this.dragContext.set('canvas'); // volta pro default
  }



  // onDragMoved(event: CdkDragMove<any>) {
  //   this.lastPointerX = event.pointerPosition.x;
  //   this.lastPointerY = event.pointerPosition.y;

  //   // 1) Linha real sob o mouse
  //   const hit = this.findRowAtPointer(this.lastPointerX, this.lastPointerY);
  //   const rowEl = hit.row;
  //   const hoveredId = hit.id ?? 'canvas';
  //   this.hoveredRowId.set(hoveredId);

  //   // 2) Nó hovered e parent
  //   const hoveredNode = this.modelSvc.getNodeById(hoveredId) ?? this.modelSvc.canvas();
  //   const parent =
  //     hoveredId === 'canvas'
  //       ? this.modelSvc.canvas()
  //       : this.modelSvc.getNodeById(hoveredNode.data.parentId) ?? this.modelSvc.canvas();

  //   const parentAlign = (parent.data.style?.['flex-direction'] as string) || 'column';
  //   const isColumn = parentAlign !== 'row';

  //   // 3) Posição relativa com base no RECT da .node-line
  //   const lineForRect = rowEl ?? document.body;
  //   const relativePosition = this.getPointerInternalPosition(
  //     lineForRect,
  //     this.lastPointerX,
  //     this.lastPointerY,
  //     parentAlign
  //   );
  //   this.pointerInsideRelativePosition.set(relativePosition);

  //   // 4) Decisão de target/index (cálculo local, sem side-effect imediato)
  //   const draggedId = this.selectionSvc.selectedElementId();

  //   let target = '';
  //   let index = -1;

  //   if (hoveredNode.data.type === 'container' && relativePosition.center) {
  //     // Drop DENTRO do container hovered
  //     target = hoveredId;
  //     // escolha: append; mude para 0 se quiser no topo
  //     index = -1;
  //   } else {
  //     // Drop na lista do PAI (antes/depois do hovered)
  //     const siblings = (parent.data.children ?? []).filter(
  //       (el: any) => el.data.id !== draggedId
  //     );
  //     let hoveredIdx = siblings.findIndex((it: any) => it.data.id === hoveredId);
  //     if (hoveredIdx < 0) hoveredIdx = siblings.length - 1;

  //     if ((isColumn && relativePosition.bottom) || (!isColumn && relativePosition.right)) {
  //       index = hoveredIdx + 1; // depois
  //     } else {
  //       index = hoveredIdx;     // antes
  //     }
  //     target = parent.data.id;
  //   }

  //   // 5) Evita “piscada”: aplica no próximo frame e só se mudou
  //   if (this.rafToken) cancelAnimationFrame(this.rafToken);
  //   this.rafToken = requestAnimationFrame(() => {
  //     if (this.lastDecision.target !== target || this.lastDecision.index !== index) {
  //       this.setCurrentDropTarget(target);
  //       this.dropIndex.set(index);
  //       this.lastDecision = { target, index };
  //     }
  //   });
  // }

  // onDrop(event: CdkDragDrop<any>) {
  //   this.isDragging.set(false);

  //   const target = this.getCurrentDropTarget();
  //   const index = this.dropIndex();

  //   // nenhuma decisão -> ignora
  //   if (!target) return;

  //   // regra de negócio do canvas (não-container não vai pro root)
  //   if (!('children' in this.selectionSvc.selectedNode().data) && target === 'canvas') return;

  //   this.modelSvc.moveNodeTo(
  //     this.selectionSvc.selectedElementId(),
  //     target,
  //     index
  //   );

  //   // limpa estado
  //   this.clearDropTarget();
  //   this.dropIndex.set(-1);
  //   this.hoveredRowId.set(null);
  //   this.lastDecision = { target: '', index: 0 };
  //   if (this.rafToken) {
  //     cancelAnimationFrame(this.rafToken);
  //     this.rafToken = null;
  //   }
  // }


  // onDrop(event: CdkDragDrop<any>) {
  //   this.isDragging.set(false);
  //   const draggedId = event.item.element.nativeElement.getAttribute('data-id');
  //   // const dropTargetId = event.container.element.nativeElement.getAttribute('data-id');
  //   // this.dropTarget = this.hoveredElementId();
  //   console.log(this.dropTarget);
  //   console.log(this.hoveredElementId());

  //   if (!this.dropTarget) return
  //   if (!('children' in this.selectionSvc.selectedNode().data) && this.dropTarget === 'canvas') return

  //   this.modelSvc.moveNodeTo(
  //     this.selectionSvc.selectedElementId(),
  //     this.dropTarget,
  //     this.dropIndex()
  //   );
  // }

  dropIndicator(nodeToStyle: Signal<LayoutElement<ContainerData | AtomicElementData>>): string {
    if (!this.isDragging()) return '';

    // 🔹 Contexto de drag: 'tree' usa hoveredRowId, 'canvas' usa hoveredElementId do SelectionService
    const ctx = this.dragContext();
    const hoveredId = ctx === 'tree' ? this.hoveredRowId() : this.hoveredElementId();

    if (!hoveredId) return '';

    const node = nodeToStyle();
    if (!node?.data?.id || node.data.id !== hoveredId) return ''; // pinta só o item realmente “hovered”

    const rp = this.pointerInsideRelativePosition();

    // Hovered node no contexto atual
    const hovered = this.modelSvc.getNodeById(hoveredId) ?? this.modelSvc.canvas();

    // Se for container e estamos “no centro” → indicar drop DENTRO (com direção conforme flex)
    if (hovered.data.type === 'container' && rp.center) {
      const align = (hovered.data.style?.['flex-direction'] as string) || 'column';
      if (align === 'row') {
        if (rp.left) return 'insideLeftDrop';
        if (rp.right) return 'insideRightDrop';
      } else {
        if (rp.top) return 'insideTopDrop';
        if (rp.bottom) return 'insideBottomDrop';
      }
      return 'insideDrop';
    }

    // Caso contrário: antes/depois na lista do PAI
    const parent = this.modelSvc.getNodeById(hovered.data.parentId) ?? this.modelSvc.canvas();
    const parentAlign = (parent.data.style?.['flex-direction'] as string) || 'column';

    if (parentAlign === 'row') {
      return rp.left ? 'leftHalf' : 'rightHalf';
    } else {
      return rp.top ? 'topHalf' : 'bottomHalf';
    }
  }

  startTreeDrag(nodeId: string) {
    this.dragContext.set('tree');
    this.isDragging.set(true);
    this.selectionSvc.selectById(nodeId, true);
  }

  startCanvasDrag(nodeId: string) {
    this.dragContext.set('canvas');
    this.isDragging.set(true);
    this.selectionSvc.selectById(nodeId, true);
  }


}
