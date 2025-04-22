import { AfterViewInit, Component, computed, effect, ElementRef, inject, Input, OnInit, Signal, signal, untracked, ViewChild, ViewContainerRef } from '@angular/core';
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
  @Input() data: ContainerData = { id: crypto.randomUUID().split("-")[0], parentId: 'canvas', containerDiv: this.containerDiv, type: 'container', style: {}, children: [] };
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  readonly modelSvc = inject(ModelService);
  id = signal('0');
  parentId = signal('0');
  direction = signal('container-flex-column ');
  //Lógica do Menu, passar para um serviço depois
  setDirection(value: string) {
    this.direction.set(`container-flex-${value} `);
  }

  canvasModel = computed(() => this.modelSvc.canvasModel());
  children = signal([] as (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]);

  readonly componentsSvc = inject(ComponentsService);

  constructor(private host: ElementRef) {}

  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);


  ngOnInit() {
    this.setDirection(this.data.style?.direction ?? 'column');
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.children.set(this.data.children ?? []);

    console.log(this.id())

    this.modelSvc.updateModel(this.id(), this.layoutModel())

  }

  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  layoutModel: Signal<LayoutElement<ContainerData>> = computed(
    () => {
      return ({
        data: {
          id: this.id(),
          parentId: this.parentId(),
          type: 'container',
          style: {
            direction: this.direction()
          },
          children: this.children()
        },
      })
    }
  );

  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel(), null, 2)
  )

  addLayoutElement(componentType: string) {
    const newLayoutElement = this.modelSvc.writeElementModel(componentType, this.id());
    this.modelSvc.addChildNode(this.id(), newLayoutElement); 
  }

  deleteContainer(){
    this.modelSvc.removeNodeById(this.id());
  }

}
