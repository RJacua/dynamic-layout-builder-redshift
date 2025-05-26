import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { AtomicElementData, ContainerData, LayoutElement, PointerResult } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  constructor() { }

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

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

  getPointerInternalPosition(
    el: HTMLElement,
    pointerX: number,
    pointerY: number,
    parentAlignment: string,
  ): PointerResult {
    const rect = el.getBoundingClientRect();

    const halfwayY = rect.top + rect.height / 2;
    const halfwayX = rect.left + rect.width / 2;

    const topInnerBoundary = rect.top + 20;
    const bottomInnerBoundary = rect.bottom - 20;
    const leftInnerBoundary = rect.left + 20;
    const rightInnerBoundary = rect.right - 20;

    let centerX = false;
    let centerY = false;

    if (parentAlignment == 'column') {
      centerY = (pointerY > topInnerBoundary) && (pointerY < bottomInnerBoundary);
    }
    else if (parentAlignment == 'row') {
      centerX = (pointerX < leftInnerBoundary) && (pointerX > rightInnerBoundary);
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
    this.dropTarget = this.hoveredElementId();

    let el = document.elementFromPoint(this.lastPointerX, this.lastPointerY) as HTMLElement;

    while (el && !el.hasAttribute('data-id') && el.parentElement) {
      el = el.parentElement;
    }

    if (this.hoveredNode().data) {

      const id = el.getAttribute('data-id') ?? 'canvas';

      let dropListItems;
      let parent = this.modelSvc.getNodeById(this.hoveredNode().data.parentId);
      let parentAlign = 'column';

      if (this.hoveredNode().data.type !== 'container') {
          dropListItems = parent.data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
          parentAlign = parent.data.style["flex-direction"];

        this.dropIndex.set(dropListItems.findIndex((item: LayoutElement<any>) => item.data.id === id) + 1);

        if ((parentAlign === 'column' && this.pointerInsideRelativePosition().top) || (parentAlign === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
          this.dropIndex.update(() => this.dropIndex() - 1);
        }
      }
      else {
        if (this.pointerInsideRelativePosition().center) {

          dropListItems = this.hoveredNode().data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
          if ((this.hoveredNode().data.style["flex-direction"] === 'column' && this.pointerInsideRelativePosition().top) || (this.hoveredNode().data.style["flex-direction"] === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
            this.dropIndex.set(0);
          }
          else this.dropIndex.set(-1);
        }
        else {
            parentAlign = parent.data.style["flex-direction"];
            this.dropTarget = parent.data.id;
            dropListItems = parent.data.children.filter((el: LayoutElement<any>) => el.data.id !== this.selectionSvc.selectedElementId());
            this.dropIndex.set(dropListItems.findIndex((item: LayoutElement<any>) => item.data.id === id) + 1);
            if ((parentAlign === 'column' && this.pointerInsideRelativePosition().top) || (parentAlign === 'row' && this.pointerInsideRelativePosition().left) && this.dropIndex() > 0) {
              this.dropIndex.update(() => this.dropIndex() - 1);
            }
        }
      }

      const relativePosition = this.getPointerInternalPosition(
        el,
        this.lastPointerX,
        this.lastPointerY,
        parentAlign
      );

      this.pointerInsideRelativePosition.set(relativePosition);
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    this.isDragging.set(false);
    const draggedId = event.item.element.nativeElement.getAttribute('data-id');
    const dropTargetId = event.container.element.nativeElement.getAttribute('data-id');
    console.log(this.dropTarget);

    if (!this.dropTarget) return
    if (!('children' in this.selectionSvc.selectedNode().data) && this.dropTarget === 'canvas') return

    this.modelSvc.moveNodeTo(
      this.selectionSvc.selectedElementId(),
      this.dropTarget,
      this.dropIndex()
    );
    if (draggedId && dropTargetId) {
    }
  }


  dropIndicator(nodeToStyle: Signal<LayoutElement<ContainerData | AtomicElementData>>): string {
    if (!this.isDragging()) return '';

    console.log(nodeToStyle().data)

    let containerAlign = this.modelSvc.getNodeById(nodeToStyle().data.parentId).data?.style["flex-direction"] ?? 'column';

    // if (nodeToStyle().data.type !== 'container' && this.hoveredElementId() === 'canvas') return '';

    if (('children' in this.hoveredNode().data) && (this.hoveredNode().data.children.length === 0 || (this.hoveredNode().data.children.length === 1) && this.hoveredElementId() === this.selectionSvc.selectedNode().data.parentId) && this.pointerInsideRelativePosition().center) {
      return 'insideDrop';
    }

    if (('children' in this.hoveredNode().data) && this.hoveredNode().data.children.length > 0 && this.pointerInsideRelativePosition().center) {
      containerAlign = this.hoveredNode().data.style["flex-direction"] ?? containerAlign;
      if (containerAlign === 'column') {
        if (this.pointerInsideRelativePosition().top) {
          'insideTopDrop';
        }
        else if (this.pointerInsideRelativePosition().bottom) {
          return 'insideBottomDrop';
        }
      }
      else if (containerAlign === 'row') {
        if (this.pointerInsideRelativePosition().right) {
          return 'insideRightDrop';
        }
        else if (this.pointerInsideRelativePosition().left) {
          return 'insideLeftDrop';
        }
      }
    }

    containerAlign = nodeToStyle().data.style["flex-direction"] ?? containerAlign;

    if (containerAlign === 'column') {
      if (this.pointerInsideRelativePosition().top) {
        let direction = 'topHalf';
        if (this.selectionSvc.selectedNode().data.type !== 'container' && this.hoveredNode().data.parentId === 'canvas') direction += ' noDropZone';
        return direction;
      }
      else if (this.pointerInsideRelativePosition().bottom) {
        let direction = 'bottomHalf';
        if (this.selectionSvc.selectedNode().data.type !== 'container' && this.hoveredNode().data.parentId === 'canvas') direction += ' noDropZone';
        return direction;
      }
    }
    else if (containerAlign === 'row') {
      if (this.pointerInsideRelativePosition().right) {
        let direction = 'rightHalf';
        if (this.selectionSvc.selectedNode().data.type !== 'container' && this.hoveredNode().data.parentId === 'canvas') direction += ' noDropZone';
        return direction;
      }
      else if (this.pointerInsideRelativePosition().left) {
        let direction = 'leftHalf';
        if (this.selectionSvc.selectedNode().data.type !== 'container' && this.hoveredNode().data.parentId === 'canvas') direction += ' noDropZone';
        return direction;
      }
    }

    return '';
  }


}
