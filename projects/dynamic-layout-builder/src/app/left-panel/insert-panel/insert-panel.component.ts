import { Component, computed, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { ComponentsService } from '../../services/components.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UndoRedoService } from '../../services/undo-redo.service';


@Component({
  selector: 'app-insert-panel',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './insert-panel.component.html',
  styleUrl: './insert-panel.component.scss'
})
export class InsertPanelComponent {
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly undoRedoSvc = inject(UndoRedoService);

  selectedId = this.selectionSvc.selectedElementId;

  isPanning = this.selectionSvc.isPanning;
  isSuppressedByCreation = this.undoRedoSvc.isSuppressedByCreation;

  selectedElementType = computed(() => {
    let selectedNode = this.selectionSvc.selectedNode();
    if (selectedNode && 'data' in selectedNode) {
      return selectedNode.data.type;
    }
    else 'none'
  });

  removeSelectedNode() {
    this.modelSvc.removeNodeById(this.selectionSvc.selectedElementId());
    this.selectionSvc.unselect();

  }

  addLayoutElement(componentType: string) {
    if (this.isPanning()) return;
    this.isSuppressedByCreation.set(true);
    
    const newLayoutElement = this.modelSvc.writeElementModel(componentType, this.selectionSvc.selectedElementId());
    this.modelSvc.addChildNode(this.selectionSvc.selectedElementId(), newLayoutElement);
    setTimeout(() => { this.selectionSvc.select(newLayoutElement.data), 0 });
    this.isSuppressedByCreation.set(false);
  }

  panningOn() {
    this.isPanning.set(true);
  }

  panningOff() {
    this.isPanning.set(false);
  }

}
