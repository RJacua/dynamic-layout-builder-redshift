import { AfterViewInit, Component, computed, effect, ElementRef, inject, Input, OnInit, Signal, signal, untracked, ViewChild, ViewContainerRef, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';
import { ContainerData, LayoutElement, AtomicElementData, Styles, Enablers } from '../interfaces/layout-elements';
import { BehaviorSubject } from 'rxjs';
import { layoutModels } from '../model'
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';
import { CommonModule } from '@angular/common';
import { BorderStylesService } from '../services/styles/borderStyles.service';
import { CornerStylesService } from '../services/styles/cornerStyles.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuComponent } from '../canvas/new-area-menu/menu.component';
import { NewAreaMenuService } from '../services/new-area-menu.service';
import { CdkDrag, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    HeaderComponent,
    ParagraphComponent,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MenuComponent,
    MatTooltipModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})

export class ContainerComponent implements LayoutElement<ContainerData>, OnInit, AfterViewInit {
  model = layoutModels[0]; //mock model para testes, tirar depois;
  type = "container";
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  @Input() data: ContainerData = { id: crypto.randomUUID().split("-")[0], parentId: 'canvas', containerDiv: this.containerDiv, type: 'container', style: {}, enabler: {}, children: [] };
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  constructor() {

    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();

      untracked(() => {
        if (node) {
          this.dynamicStyle.set(node.data.style);
          this.dynamicStyle.update(() => this.borderStylesSvc.changeBorderStylesByEnablers(this.dynamicStyle(), (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
          this.dynamicStyle.update(() => this.cornerStylesSvc.changeCornerStylesByEnablers(this.dynamicStyle(), (this.nodeSignal()?.data.enabler.enableIndividualCorner === 'true'), this.nodeSignal()?.data.type)() ?? {});
        }
      })

    });

  }

  readonly modelSvc = inject(ModelService);
  readonly componentsSvc = inject(ComponentsService);
  readonly selectionSvc = inject(SelectionService);
  readonly borderStylesSvc = inject(BorderStylesService);
  readonly cornerStylesSvc = inject(CornerStylesService);
  readonly newAreaMenuSvc = inject(NewAreaMenuService);

  id = signal('0');
  parentId = signal('0');
  initialData: string[] = this.newAreaMenuSvc.rootLevelNodesAdd.slice();


  isFocused = computed(() => {
    return this.id() === this.selectionSvc.selectedElementId();
  });

  isHover = computed(() => {
    if (this.id() === this.selectionSvc.hoveredElementId()) return true;
    if(!this.isDragging()) return false;
    return (this.modelSvc.isChildof(this.selectionSvc.hoveredElementId(), this.nodeSignal()) && this.modelSvc.getNodeById(this.selectionSvc.hoveredElementId()).data.type !== 'container');
  });

  isDragging = this.selectionSvc.isDragging;

  canvasModel = computed(() => { this.modelSvc.canvasModel() });
  children = signal([] as (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]);
  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id()));

  dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());


  ngOnInit() {
    // this.setDirection(this.data.style?.direction ?? 'column');
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.children.set(this.data.children ?? []);

    this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)() ?? {});

    this.modelSvc.updateModel(this.id(), this.nodeSignal());

    this.initialData = this.newAreaMenuSvc.rootLevelNodesAdd.slice();

  }

  ngAfterViewInit() {
    this.elementRef.next(this.containerDiv);
  }

  addLayoutElement(componentType: string) {
    const newLayoutElement = this.modelSvc.writeElementModel(componentType, this.id());
    this.modelSvc.addChildNode(this.id(), newLayoutElement);
    setTimeout(() => { this.selectionSvc.select(newLayoutElement.data), 1 });
  }

  deleteContainer() {
    this.modelSvc.removeNodeById(this.id());
  }

  processContainerStyle() {
    this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)() ?? {});
    this.dynamicStyle.set(this.cornerStylesSvc.changeCornerStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableIndividualCorner === 'true'), this.nodeSignal()?.data.type)() ?? {});
    // console.log("aqui: ", this.dynamicStyle())
  }

  onElementHover(event: MouseEvent) {
    let el = event.target as HTMLElement;

    while (el && !el.hasAttribute('data-id') && el.parentElement) {
      el = el.parentElement;
    }

    if (el && el.hasAttribute('data-id')) {
      const id = el.getAttribute('data-id');
      if (id) {
        this.selectionSvc.hoverById(id);
      }
    }
    // console.log("selected: ", this.selectionSvc.selectedElementId());
    // console.log("hovered: ", this.selectionSvc.hoveredElementId());
  }

  onElementMouseLeave(event: MouseEvent) {
    const toElement = event.relatedTarget as HTMLElement;

    let el = toElement;
    while (el && el !== document.body) {
      if (el.hasAttribute && el.hasAttribute('data-id')) {
        return;
      }
      el = el.parentElement!;
    }

    this.selectionSvc.unhover();
  }

  onDrop() {
    this.modelSvc.moveNodeTo(this.selectionSvc.selectedElementId(), this.selectionSvc.hoveredElementId());
    this.isDragging.set(false);
    console.log("drop:", this.selectionSvc.isDragging());
  }

  onPlusClick() {
    this.selectionSvc.selectById(this.id(), true);
  }

  onHandleClick() {
    this.selectionSvc.selectById(this.id(), true);
  }

}