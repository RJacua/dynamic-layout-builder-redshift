import { inject, Injectable, signal } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  constructor() { }

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  isDragging = signal(false);

  onDrop(event: CdkDragDrop<any>) {
    const draggedId = event.item.element.nativeElement.getAttribute('data-id');
    console.log(draggedId);
    const dropTargetId = event.container.element.nativeElement.getAttribute('data-id');
    console.log(dropTargetId)
    const index = event.currentIndex ?? -1;
    console.log(index);
    
    this.modelSvc.moveNodeTo(this.selectionSvc.selectedElementId(), this.selectionSvc.hoveredElementId(), index);
    // this.modelSvc.moveNodeTo(draggedId!, dropTargetId!, index);
    this.isDragging.set(false);
  }

}
