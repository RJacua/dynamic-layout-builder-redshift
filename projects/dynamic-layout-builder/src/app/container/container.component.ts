import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';

import { LayoutElement, ContainerData, LayoutModel, AtomicElementData, LayoutData } from '../interfaces/layout-elements';
import { BehaviorSubject, filter } from 'rxjs';

import { layoutModels } from '../model'

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

export class ContainerComponent implements LayoutElement<ContainerData>, OnInit, AfterViewInit {
  model = layoutModels[0]; //mock model para testes, tirar depois;
  type = "container";
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;

  direction = signal('container-flex-column ');
  //Lógica do Menu, passar para um serviço depois
  setDirection(value: string) {
    this.direction.set(`container-flex-${value} `);
  }


  readonly componentsSvc = inject(ComponentsService);
  constructor(private host: ElementRef) { }

  addLayoutElement(componentType: string, data?: LayoutData) {
    this.componentsSvc.addComponent(componentType.toLowerCase(), this.containerDiv, data);
  }

  @Input() data: ContainerData = {
    containerDiv: this.containerDiv,
    type: 'container',
  };

  
  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);


  ngOnInit() {
    this.setDirection(this.data.style?.direction || 'column');
  }
  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container?: ViewContainerRef) {
    
    if(this.elementRef.value){
      container = this.elementRef.value ;
    }

    if(container){
      this.componentsSvc.createLayoutFromModel(model, container);
    }
    else {
      console.error("Container não definido");
      return;
    }
    
  }

}
