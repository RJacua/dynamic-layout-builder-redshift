import { AfterViewInit, Component, computed, effect, ElementRef, inject, Input, OnInit, Signal, signal, untracked, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';
import { ContainerData, LayoutElement, AtomicElementData } from '../interfaces/layout-elements';
import { BehaviorSubject } from 'rxjs';
import { layoutModels } from '../model'
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    HeaderComponent,
    ParagraphComponent,
    CommonModule,
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
  constructor() {
    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();

      if (node) {
        this.dynamicStyle.set(node.data.style);
      }
    
      // console.log("on effect style:", this.dynamicStyle());
    });

  }

  readonly modelSvc = inject(ModelService);
  readonly componentsSvc = inject(ComponentsService);
  readonly selectionSvc = inject(SelectionService);

  id = signal('0');
  parentId = signal('0');

  isFocused = computed(() => {
    return this.id() === this.selectionSvc.selectedElementId();
  });
  
  canvasModel = computed(() => {this.modelSvc.canvasModel()});
  children = signal([] as (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]);
  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id()));
  dynamicStyle = signal(this.nodeSignal()?.data.style);

  ngOnInit() {
    // this.setDirection(this.data.style?.direction ?? 'column');
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.children.set(this.data.children ?? []);

    this.dynamicStyle.set(this.data.style ?? {});

    this.modelSvc.updateModel(this.id(), this.nodeSignal());
  }

  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  addLayoutElement(componentType: string) {
    const newLayoutElement = this.modelSvc.writeElementModel(componentType, this.id());
    this.modelSvc.addChildNode(this.id(), newLayoutElement);
    setTimeout(() => {this.selectionSvc.select(newLayoutElement.data), 0});
  }

  deleteContainer(){
    this.modelSvc.removeNodeById(this.id());
  }

}