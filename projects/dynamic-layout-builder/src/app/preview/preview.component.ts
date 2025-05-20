import { Component, computed, effect, HostListener, inject, signal, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ModelService } from '../services/model.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutElement, ContainerData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../components/container/container.component';
import { CanvasComponent } from '../components/canvas/canvas.component';

@Component({
  selector: 'app-preview',
  imports: [
    CommonModule,
    ContainerComponent,
    CanvasComponent
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly modelSvc = inject(ModelService);
  readonly route = inject(ActivatedRoute);

  encoded = signal<string>('');
  decoded = signal<string>('');
  canvasModel = computed(() => this.modelSvc.canvasModel());
  parsed: Signal<LayoutElement<ContainerData>[]> = signal([]);

  constructor() {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.encoded.set(params['encoded']);
    });

    if (this.encoded()) {
      try {
        var decodedStr = decodeURIComponent(atob(this.encoded()));
        this.decoded.set(decodedStr);
        console.log("INIT: ", this.decoded())
        this.parsed = computed(() => JSON.parse(this.decoded()));
        this.renderFromModel(this.parsed());
      } catch (error) {
        console.error("Can not decode url", error)
      }
    }


  }

  renderFromModel(model: LayoutElement<ContainerData>[]) {
    this.modelSvc.resetCanvasModel();
    this.modelSvc.setCanvasModel(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }
}