import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';

import { LayoutElement, ContainerData, LayoutModel, AtomicElementData } from '../interfaces/layout-elements';
import { BehaviorSubject, filter } from 'rxjs';

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

export class ContainerComponent implements LayoutElement<ContainerData>, AfterViewInit {
  type = "container";
  @ViewChild('container', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;

  readonly componentsSvc = inject(ComponentsService);
  constructor(private host: ElementRef) { }

  addLayoutElement(componentType: string) {
    this.componentsSvc.addComponent(componentType.toLowerCase(), this.containerDiv);
  }

  @Input() data: ContainerData = {
    containerDiv: this.containerDiv,
    type: 'container',
    alignment: "center"
  };

  
  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);

  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  model: LayoutModel<ContainerData> = {
    data: { type: 'container' },
    children: [
      { data: { type: 'header', text: 'Coiso' } },
      { data: { type: 'paragraph', text: 'Teste Teste Teste' } },
      { data: { type: 'container' } },
    ]
  }
  createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container: ViewContainerRef) {
    this.componentsSvc.createLayoutFromModel(model, container);
  }

}