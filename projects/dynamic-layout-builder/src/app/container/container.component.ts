import { AfterViewInit, Component, computed, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, Signal, signal, ViewChild, ViewContainerRef } from '@angular/core';
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
  @Input() data: ContainerData = { id: crypto.randomUUID().split("-")[0], containerDiv: this.containerDiv, type: 'container', };
  @Output() modelChange = new EventEmitter<LayoutModel<any>>();

  id = signal('0');
  direction = signal('container-flex-column ');
  //Lógica do Menu, passar para um serviço depois
  setDirection(value: string) {
    this.direction.set(`container-flex-${value} `);
  }

  childrenModels = signal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);

  readonly componentsSvc = inject(ComponentsService);
  constructor(private host: ElementRef) { }

  addLayoutElement(componentType: string, data?: LayoutData) {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.componentsSvc.addComponent(componentType.toLowerCase(), this.containerDiv, id, data);

    if (ref) {
      (ref.instance as any).modelChange.subscribe((childModel: LayoutModel<any>) => {
        this.onChildModelUpdate(childModel);
      });

      if(componentType.toLowerCase() === 'container'){
        this.childrenModels.update((children: any) => [
          ...children,
          {
            data: ref.instance.data,
            children: []
          }
        ]);
      }
      else {
        this.childrenModels.update((children: any) => [
          ...children,
          {
            data: ref.instance.data,
          }
        ]);
      }
    }

    this.emitModel();
  }



  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);


  ngOnInit() {
    this.setDirection(this.data.style?.direction || 'column');
    this.id.set(this.data.id);

    // console.log(`componente do tipo ${this.type} e id ${this.id()} criado`)
  }
  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  // createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container?: ViewContainerRef) {

  //   if (this.elementRef.value) {
  //     container = this.elementRef.value;
  //   }

  //   if (container) {
  //     this.componentsSvc.createLayoutFromModel(model, container);
  //   }
  //   else {
  //     console.error("Container não definido");
  //     return;
  //   }

  // }


  layoutModel: Signal<LayoutModel<ContainerData>> = computed(
    () => ({
      data: {
        id: this.id(),
        type: 'container',
        style: {
          direction: this.direction()
        },
      },
      children: this.childrenModels()
    })
  );

  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel(), null, 2)
  )

  emitModel() {
    console.log("Emiting ", this.layoutModel());
    this.modelChange.emit({
      data: this.layoutModel(),
    });
  }

  onChildModelUpdate(childModel: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)) {
    this.childrenModels.update(() =>
      this.childrenModels().map((cm) => {
        console.log(cm, childModel);
        return cm.data.id === (childModel.data as any).data.id ? childModel : cm
      }
      )
    );
  }

}
