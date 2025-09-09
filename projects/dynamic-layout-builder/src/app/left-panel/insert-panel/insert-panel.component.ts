import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { ComponentsService } from '../../services/components.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UndoRedoService } from '../../services/functionalities/undo-redo.service';
import { ExportImportService } from '../../services/functionalities/export-import.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportModelDialogComponent } from '../../components/export-model-dialog/export-model-dialog.component';
import { Router } from '@angular/router';
import { EncodeService } from '../../services/encode.service';
import { PanningService } from '../../services/panning.service';
import { TextEditorService } from '../../services/text-editor.service';
import { BannerService } from '../../services/banner.service';



@Component({
  selector: 'app-insert-panel',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './insert-panel.component.html',
  styleUrl: './insert-panel.component.scss',
})
export class InsertPanelComponent {
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly undoRedoSvc = inject(UndoRedoService);
  readonly dialog = inject(MatDialog);
  readonly importSvc = inject(ExportImportService);
  readonly router = inject(Router);
  readonly encodeSvc = inject(EncodeService);
  readonly panningSvc = inject(PanningService);
  readonly textEditorSvc = inject(TextEditorService);
  readonly bannerSvc = inject(BannerService);


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

  encodedStr = computed(() => this.encodeSvc.encodedStr());

  removeSelectedNode() {
    // this.modelSvc.removeNodeById(this.selectionSvc.selectedElementId());
    // this.selectionSvc.unselect();
    const id = this.selectionSvc.selectedElementId();
    if (id && id !== 'canvas') {
      this.bannerSvc.show({
        message: 'Are you sure you want to delete this element?',
        variant: 'warning',
        actions: [
          { id: 'yes', label: 'Yes', kind: 'danger' },
          { id: 'no', label: 'No', kind: 'default' },
        ]
      }).then(result => {
        if (result === 'yes') {
          this.modelSvc.removeNodeById(id);
          this.selectionSvc.unselect();
        }
      });
    }
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

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportModelDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  import() {
    this.importSvc.importModel();
  }

  preview() {
    this.router.navigate(['/preview'], {
      fragment: this.encodedStr(),
    });
  }

  fullView() {
    this.panningSvc.emitFullViewFlag();
  }

  fitView() {
    this.panningSvc.emitFitViewFlag();
  }

  createLink() {
    console.log("create link clicado: ", this.selectionSvc.selectedElementId());
    this.textEditorSvc.createLink(this.selectionSvc.selectedElementId());
    // this.selectionSvc.selectCanvas();
  }

}
