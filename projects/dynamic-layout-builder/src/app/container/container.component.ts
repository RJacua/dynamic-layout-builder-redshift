import { AfterViewInit, Component, computed, ElementRef, inject, Input, OnInit, Signal, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';

import { ContainerData, LayoutElement, AtomicElementData } from '../interfaces/layout-elements';
import { BehaviorSubject } from 'rxjs';

import { layoutModels } from '../model'
import { ModelService } from '../services/model.service';

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
  @Input() data: ContainerData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', containerDiv: this.containerDiv, type: 'container', style: {} };
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  readonly modelSvc = inject(ModelService);
  id = signal('0');
  parentId = signal('0');
  direction = signal('container-flex-column ');
  //Lógica do Menu, passar para um serviço depois
  setDirection(value: string) {
    this.direction.set(`container-flex-${value} `);
  }

  childrenModels = signal<(LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);

  readonly componentsSvc = inject(ComponentsService);
  // readonly modelSvc = inject(ModelService);


  constructor(private host: ElementRef) {
    // effect(() => {
    //   this.componentsSvc.emitModel(this.layoutModel, this.modelChange);
    // })
  }


  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);


  ngOnInit() {
    this.setDirection(this.data.style?.direction || 'column');
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);

    // console.log(`componente do tipo ${this.type} e id ${this.id()} criado`)
  }
  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  layoutModel: Signal<LayoutElement<ContainerData>> = computed(
    () => {
      console.log("container children models: ", this.childrenModels());
      return ({
        data: {
          id: this.id(),
          parentId: this.parentId(),
          type: 'container',
          style: {
            direction: this.direction()
          },
          children: this.childrenModels()
        },
      })
    }
  );

  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel(), null, 2)
  )

  addLayoutElement(componentType: string) {
    const newLayoutElement = this.componentsSvc.addLayoutElement(componentType, this.childrenModels, this.containerDiv, this.id());
    if (newLayoutElement) {
      this.modelSvc.addChildModel(this.id(), newLayoutElement)
    }

      // this.modelSvc.addChildElement(this.id(), this.modelSvc.createChildModel(this.id, componentType))
    
  }
}
