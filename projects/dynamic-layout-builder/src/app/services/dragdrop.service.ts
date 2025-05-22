import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { AtomicElementData, ContainerData, LayoutElement, PointerResult } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  constructor() {}

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  isDragging = signal(false);

  hoveredNode = this.selectionSvc.hoveredNode;

  onDrop(event: CdkDragDrop<any>) {
    const draggedId = event.item.element.nativeElement.getAttribute('data-id');
    // console.log(draggedId);
    const dropTargetId =
      event.container.element.nativeElement.getAttribute('data-id');
    // console.log(dropTargetId);
    const index = event.currentIndex ?? -1;
    // console.log(index);

    if(this.dropIndex() < 0) return;

    this.modelSvc.moveNodeTo(
      this.selectionSvc.selectedElementId(),
      this.selectionSvc.hoveredElementId(),
      this.dropIndex()
    );
    if (draggedId && dropTargetId) {
      // this.modelSvc.moveNodeTo(draggedId, dropTargetId, index);
    }
    // this.modelSvc.moveNodeTo(draggedId!, dropTargetId!, index);
    this.isDragging.set(false);
  }

  lastPointerX: number = 0;
  lastPointerY: number = 0;

  dropIndex = signal(-1);

  pointerInsideRelativePosition: WritableSignal<PointerResult> = signal({bottom: false, left: false, right: false, top: false});
  pointerOutRelativePosition: WritableSignal<PointerResult> = signal({bottom: false, left: false, right: false, top: false});

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

  getPointerInternalPosition(
    el: HTMLElement,
    pointerX: number,
    pointerY: number
  ): PointerResult {
    const rect = el.getBoundingClientRect();

    const halfwayY = rect.top + rect.height / 2;
    const halfwayX = rect.left + rect.width / 2;

    return {
      top: pointerY < halfwayY,
      bottom: pointerY >= halfwayY,
      left: pointerX < halfwayX,
      right: pointerX >= halfwayX,
    };
  }

onDragMoved(event: CdkDragMove<any>) {
  this.lastPointerX = event.pointerPosition.x;
  this.lastPointerY = event.pointerPosition.y;

  let el = document.elementFromPoint(this.lastPointerX, this.lastPointerY) as HTMLElement;

  while (el && !el.hasAttribute('data-id') && el.parentElement) {
    el = el.parentElement;
  }

  if (this.hoveredNode().data) {

    //PARAR DE ACHAR INDEX COM O DROP LIST; ACHE COM A FONTE DE VERDADE!!!

    const id = this.hoveredNode().data.id;
    let dropListItems;
    let parent = this.modelSvc.getNodeById(this.hoveredNode().data?.parentId);
    let containerAlign;

    if(this.hoveredNode().data?.type !== 'container'){
      if(parent.data.type === 'container'){
        dropListItems = parent.data.children;
        containerAlign = parent.data.style["flex-direction"];
      }
      else {
        containerAlign = 'column';
        dropListItems = this.modelSvc.canvasModel();
      }
    }
    else dropListItems = this.hoveredNode().data?.children;

    this.dropIndex.set(dropListItems.findIndex((item: LayoutElement<any>) => item.data.id === id) + 1);

    if((containerAlign === 'column' && this.pointerInsideRelativePosition().top) || (containerAlign === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
      this.dropIndex.update(() => this.dropIndex() - 1);
    }

    console.log(this.dropIndex());
    console.log(this.pointerInsideRelativePosition());
  
    const relativePosition = this.getPointerInternalPosition(
      el,
      this.lastPointerX,
      this.lastPointerY
    );

    this.pointerInsideRelativePosition.set(relativePosition);
  }
}


  dropIndicator(node: Signal<LayoutElement<ContainerData | AtomicElementData>>): string {
    let containerAlign = this.modelSvc.getNodeById(node().data.parentId)?.data?.style["flex-direction"] ?? 'none';
      if(containerAlign === 'column') {
        if(this.pointerInsideRelativePosition().top) {
          return 'topHalf';
        }
        else if(this.pointerInsideRelativePosition().bottom) {
          return 'bottomHalf';
        }
      }
      else if(containerAlign === 'row') {
        if(this.pointerInsideRelativePosition().right) {
          return 'rightHalf';
        }
        else if(this.pointerInsideRelativePosition().left) {
          return 'leftHalf';
        }
      }
    
    return '';
  }

}
