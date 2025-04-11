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

  model: LayoutModel<ContainerData> = {
    data: { type: 'container' },
    children: [
      { data: { type: 'header', text: 'Título' } },
      { data: { type: 'paragraph', text: 'Teste Teste Teste' } },
      { data: { type: 'container' } },
    ]
  }

  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);

  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container: ViewContainerRef) {

    const element = this.componentsSvc.addComponent(model.data.type, container, model.data);

    if (element && model.data.type === 'container') {
      ((element.instance as any).elementRef as BehaviorSubject<ViewContainerRef | null>).pipe(
        filter((value) => !!value)
      ).subscribe((elementRef) => {

        console.log(element);
        model.children?.map(
          (c) => {
            if (c.data.type === 'container') {
              this.createLayoutFromModel(c, elementRef);
            }
            else this.componentsSvc.addComponent(c.data.type, elementRef, c.data)
          }
        )
      })
    }
  }

}