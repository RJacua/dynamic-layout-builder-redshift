import { Component, computed, inject, Signal } from '@angular/core';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-layers-panel',
  imports: [],
  templateUrl: './layers-panel.component.html',
  styleUrl: './layers-panel.component.scss'
})
export class LayersPanelComponent {

  readonly modelSvc = inject(ModelService);

  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null, 2)
  )

}
