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
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  readonly componentsSvc = inject(ComponentsService);

  layoutModel = signal<LayoutModel<LayoutModel<ContainerData> | LayoutElement<AtomicElementData>>[]>([]);
  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel())
  )
  openNewAreaDialog() {
    console.log("open new area dialog");
  }

  addContainer(){
    const ref = this.componentsSvc.addComponent('container', this.container, crypto.randomUUID().split("-")[0]);

    if(ref) {

    }
  }
}
