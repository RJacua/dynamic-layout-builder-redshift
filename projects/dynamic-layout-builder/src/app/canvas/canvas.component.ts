import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent as ContainerComponent } from "../container/container.component";
import { ComponentsService } from '../services/components.service';
import { AtomicElementData, ContainerData, LayoutElement, LayoutModel } from '../interfaces/layout-elements';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly componentsSvc = inject(ComponentsService);

  childrenModels = signal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);
  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.childrenModels(), null, 2)
  )

  // onChildModelUpdate(childModel: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)) {
  //   this.childrenModels.update(() =>
  //     this.childrenModels().map((cm) => {
  //       console.log(cm.data.id, childModel);
  //       return cm.data.id === (childModel.data as any).data.id ? childModel : cm
  //     }
  //     )
  //   );
  // }

  // addContainer() {
  //   const id = crypto.randomUUID().split('-')[0];
  //   const ref = this.componentsSvc.addComponent('container', this.container, id);

  //   if (ref) {
  //     (ref.instance as any).modelChange.subscribe((childModel: LayoutModel<any>) => {
  //       this.onChildModelUpdate(childModel);
  //     });

  //     this.childrenModels.update((children: any) => [
  //       ...children,
  //       {
  //         id,
  //         type: 'container',
  //         data: ref.instance.data,
  //         children: []
  //       }
  //     ]);
  //   }
  // }

  addContainer() {
    this.componentsSvc.addContainer(this.childrenModels, this.containerDiv);
  }

}
