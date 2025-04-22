import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal, untracked, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from "../container/container.component";
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  providers: []
})

export class CanvasComponent {
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly modelSvc = inject(ModelService);

  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null, 2)
  )

  constructor() {}

  addContainer() {
    const newContainer = this.modelSvc.writeElementModel('container', 'canvas');
    this.modelSvc.addChildNode('canvas', newContainer);
  }
}
