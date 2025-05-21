import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
  untracked,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { ComponentsService } from '../../services/components.service';
import {
  ContainerData,
  LayoutElement,
  AtomicElementData,
  Styles,
  Enablers,
} from '../../interfaces/layout-elements';
import { BehaviorSubject } from 'rxjs';
import { layoutModels } from '../../model';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { CommonModule } from '@angular/common';
import { BorderStylesService } from '../../services/styles/border-styles.service';
import { CornerStylesService } from '../../services/styles/corner-styles.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuComponent } from '../canvas/new-area-menu/menu.component';
import { NewAreaMenuService } from '../../services/new-area-menu.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DragDropService } from '../../services/dragdrop.service';
import { EnablerService } from '../../services/styles/enabler.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';

@Component({
  selector: 'app-container',
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
    DragDropModule,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class ContainerComponent
  implements LayoutElement<ContainerData>, OnInit
{
  model = layoutModels[0]; //mock model para testes, tirar depois;
  type = 'container';
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  @Input() data: ContainerData = {
    id: crypto.randomUUID().split('-')[0],
    parentId: 'canvas',
    type: 'container',
    style: {},
    enabler: {},
    children: [],
  };
  @Input() editMode: boolean = true;
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  constructor() {
    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();

      untracked(() => {
        if (node) {
          this.processContainerStyle(node);
        }
      });
    });
  }

  readonly modelSvc = inject(ModelService);
  readonly componentsSvc = inject(ComponentsService);
  readonly selectionSvc = inject(SelectionService);
  // readonly borderStylesSvc = inject(BorderStylesService);
  // readonly cornerStylesSvc = inject(CornerStylesService);
  readonly enablerSvc = inject(EnablerService);
  readonly newAreaMenuSvc = inject(NewAreaMenuService);
  readonly dragDropSvc = inject(DragDropService);
  readonly generalSvc = inject(GeneralFunctionsService);

  id: string = '0';
  parentId = signal('0');
  initialData: string[] = this.newAreaMenuSvc.rootLevelNodesAdd.slice();

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });

  isHover = computed(() => {
    if (this.id === this.selectionSvc.hoveredElementId()) return true;
    if (!this.isDragging()) return false;
    return (
      this.modelSvc.isChildof(
        this.selectionSvc.hoveredElementId(),
        this.nodeSignal()
      ) &&
      this.modelSvc.getNodeById(this.selectionSvc.hoveredElementId()).data
        .type !== 'container'
    );
  });

  isDragging = this.dragDropSvc.isDragging;

  canvasModel = computed(() => {
    this.modelSvc.canvasModel();
  });
  children = signal(
    [] as (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  );
  elementRef = new BehaviorSubject<ViewContainerRef | null>(null);
  nodeSignal: any;

  dynamicStyle: WritableSignal<any> = signal(null);

  ngOnInit() {
    this.id = this.data.id;
    this.parentId.set(this.data.parentId);
    this.children.set(this.data.children ?? []);

    this.nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));

    this.modelSvc.updateModel(this.id, this.nodeSignal());

    this.initialData = this.newAreaMenuSvc.rootLevelNodesAdd.slice();

    this.processContainerStyle(this.nodeSignal());
  }

  processContainerStyle(node: any) {
    this.dynamicStyle.set(node.data.style);
    this.dynamicStyle.update(() =>
      this.enablerSvc.changeStylesByEnablers(
        this.dynamicStyle(),
        node.data.enabler,
        node.data.type
      )()
    );
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
  }

  onElementMouseLeave(event: MouseEvent) {
    this.selectionSvc.unhover();
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dragDropSvc.onDrop(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      this.dragDropSvc.onDrop(event);
    }
  }
  forceSelection() {
    this.selectionSvc.selectById(this.id, true);
  }
}
