import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { LayersPanelComponent } from "./layers-panel/layers-panel.component";
import { InsertPanelComponent } from "./insert-panel/insert-panel.component";
import { AngularSplitModule } from 'angular-split';
import { ModelService } from '../services/model.service';
// npm install angular-split

@Component({
  selector: 'app-left-panel',
  imports: [MatDividerModule, LayersPanelComponent, InsertPanelComponent, AngularSplitModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss'
})
export class LeftPanelComponent {

  modelSvc = inject(ModelService);
  canvasModel = this.modelSvc.canvasModel;

}
