import { Component, computed, effect, HostListener, inject, signal, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ModelService } from '../services/model.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutElement, ContainerData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../components/container/container.component';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { EncodeService } from '../services/encode.service';

@Component({
  selector: 'app-preview',
  imports: [
    CommonModule,
    CanvasComponent
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly modelSvc = inject(ModelService);
  readonly encodeSvc = inject(EncodeService);
  readonly activeRoute = inject(ActivatedRoute);

  encodedStr = signal<string>('');
  decodedStr = signal<string>('');
  parsedJSON: Signal<LayoutElement<ContainerData>[]> = signal([]);

  constructor() {

  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.encodedStr.set(params['encoded']);
    });

    if (this.encodedStr()) {
      try {
        this.decodedStr.set(this.encodeSvc.decodedStr());
        // console.log("INIT: ", this.decodedStr())
        this.parsedJSON = computed(() => JSON.parse(this.decodedStr()));
        this.renderFromModel(this.parsedJSON());
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