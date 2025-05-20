import { Component, computed, effect, HostListener, inject, signal, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ModelService } from '../services/model.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutElement, ContainerData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../components/container/container.component';
import { layoutModels } from '../model';
import { CanvasComponent } from '../components/canvas/canvas.component';

@Component({
  selector: 'app-presentation',
  imports: [
    CommonModule,
    ContainerComponent,
    CanvasComponent
  ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.scss'
})
export class PresentationComponent {
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly modelSvc = inject(ModelService);
  readonly route = inject(ActivatedRoute);

  canvasModel = computed(() => this.modelSvc.canvasModel());
  models: LayoutElement<ContainerData>[][] = [[]];
  modelIndex = -1;
  constructor() {

  }

  ngOnInit() {
    this.loadPresentation();
  }

  renderFromModel(model: LayoutElement<ContainerData>[]) {
    this.modelSvc.resetCanvasModel();
    this.modelSvc.setCanvasModel(model);
  }

  loadPresentation() {
    this.models = layoutModels;
    this.modelIndex = 0;
    this.renderFromModel(this.models[this.modelIndex]);
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKey(event: KeyboardEvent) {
    if (this.models.length > 1) {
      if (event.key === 'ArrowLeft') {
        if (this.modelIndex >= 1) {
          this.modelIndex = this.modelIndex - 1;
          this.renderFromModel(this.models[this.modelIndex]);
        }
      }
      if (event.key === 'ArrowRight') {
        if (this.modelIndex < this.models.length - 1) {
          this.modelIndex = this.modelIndex + 1;
          this.renderFromModel(this.models[this.modelIndex]);
        }
      }
    }
  }


}