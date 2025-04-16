import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from "../container/container.component";
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  providers: []
})

export class CanvasComponent {
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);

  childrenModels = this.modelSvc.childrenModels;
  childrenModelsString: Signal<string> = computed(
    () => JSON.stringify(this.childrenModels(), null, 2)
  )

  constructor(){

  }

  addContainer() {
    const newContainer = this.componentsSvc.addContainer(this.childrenModels, this.containerDiv, 'canvas');
    if (newContainer){
      this.modelSvc.addChildModel('canvas', newContainer)
    }
  }
}
