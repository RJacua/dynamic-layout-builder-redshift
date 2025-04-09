import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { AreaComponent as ContainerComponent } from "../container/container.component";
import { ComponentsService } from '../services/components.service';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule, ContainerComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  readonly componentsSvc = inject(ComponentsService);

  openNewAreaDialog() {
    console.log("open new area dialog");
  }

  addArea(){
    console.log("add new area");
    this.componentsSvc.addComponent('area', this.container);
  }

}
