import { Component, computed, effect, inject, Input, signal, Signal } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { LayoutElement } from '../../interfaces/layout-elements';
import { LayersTreeComponent } from './layers-tree/layers-tree.component';
import { SelectionService } from '../../services/selection.service';


@Component({
  selector: 'app-layers-panel',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, CommonModule, LayersTreeComponent],
  templateUrl: './layers-panel.component.html',
  styleUrl: './layers-panel.component.scss'
})
export class LayersPanelComponent {

  @Input() data: string = '0';
  modelSvc = inject(ModelService);

  canvasModel = this.modelSvc.canvasModel;
}
