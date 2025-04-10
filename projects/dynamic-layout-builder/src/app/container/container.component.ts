import { Component, ElementRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';

import { LayoutElement, ContainerData } from '../interfaces/layout-elements';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    HeaderComponent,
    ParagraphComponent,
    ContainerComponent,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})

export class ContainerComponent implements LayoutElement<ContainerData>{
  type = "area";
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  htmlContent: string = '[{ "type": "paragraph", "content": "Olá mundo" }]';

  readonly componentsSvc = inject(ComponentsService);
  constructor(private host: ElementRef) { }

  addLayoutElement(componentType: string) {
    this.componentsSvc.addComponent(componentType.toLowerCase(), this.container);
  }

  @Input() data: ContainerData = {
    alignment: "center"
  };

}