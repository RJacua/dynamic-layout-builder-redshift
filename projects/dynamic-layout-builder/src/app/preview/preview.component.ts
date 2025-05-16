import { Component, computed, effect, inject, signal, Signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ModelService } from '../services/model.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutElement, ContainerData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../container/container.component';
import { layoutModels } from '../model';
import { CanvasComponent } from '../canvas/canvas.component';

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

  constructor( ) {
    effect(() => console.log("TEST: ", this.parsed))
    // effect(() => console.log(this.canvasModel()))
  }

  ngOnInit() {
    let param = this.route.snapshot.paramMap.get('encoded');
    // console.log("rota: ", param);

    if (param) {
      this.encoded.set(param);

      try {
        var decodedStr = decodeURIComponent(atob(param));
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
    this.modelSvc.setCanvasModel(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }


}
