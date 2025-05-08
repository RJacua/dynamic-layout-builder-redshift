import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-insert-panel',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './insert-panel.component.html',
  styleUrl: './insert-panel.component.scss'
})
export class InsertPanelComponent {
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  removeSelectedNode(){
    this.modelSvc.removeNodeById(this.selectionSvc.selectedElementId());
    this.selectionSvc.unselect();

  }

}
