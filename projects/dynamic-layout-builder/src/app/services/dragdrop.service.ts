import { inject, Injectable, signal } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  constructor() { }

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  isDragging = signal(false);

  onDrop() {
    this.modelSvc.moveNodeTo(this.selectionSvc.selectedElementId(), this.selectionSvc.hoveredElementId());
    this.isDragging.set(false);
  }

}
