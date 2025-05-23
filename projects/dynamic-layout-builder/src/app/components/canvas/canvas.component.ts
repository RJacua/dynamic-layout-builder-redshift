import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  computed,
  effect,
  Signal,
  untracked,
  ViewChild,
  ViewContainerRef,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewAreaMenuService } from '../../services/new-area-menu.service';
import { SelectionService } from '../../services/selection.service';
import { MenuComponent } from './new-area-menu/menu.component';
import { StylesService } from '../../services/styles/styles.service';
import { ContainerComponent } from '../container/container.component';
import { ComponentsService } from '../../services/components.service';
import { ModelService } from '../../services/model.service';
import { HeaderComponent } from '../header/header.component';
import {
  Canvas,
  ContainerData,
  LayoutElement,
} from '../../interfaces/layout-elements';
import { layoutModels } from '../../model';
import { Router, RouterLink } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { DragDropService } from '../../services/dragdrop.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    ContainerComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MenuComponent,
    MatTooltipModule,
    DragDropModule,
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  providers: [],
})
export class CanvasComponent {
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  @Input() data: Canvas = { id: 'canvas', type: 'canvas', children: [] };
  @Input() editMode: boolean = true;

  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly router = inject(Router);

  readonly dragDropSvc = inject(DragDropService);

  canvasModel = computed(() => this.modelSvc.canvasModel());

  onlyContainers = computed(() =>
    this.canvasModel().filter((el) => el.data.type === 'container')
  );
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null)
    // () => this.customStringify(this.canvasModel())
  );

  canvasCustomString: Signal<string> = computed(
    // () => JSON.stringify(this.canvasModel(), null)
    () => this.customStringify(this.canvasModel())
  );

  utf8Str: Signal<string> = computed(() =>
    encodeURIComponent(this.canvasModelsString())
  );
  btoa: Signal<string> = computed(() => btoa(this.utf8Str()));
  atob: Signal<string> = computed(() => atob(this.btoa()));
  decoded: Signal<string> = computed(() => decodeURIComponent(this.atob()));

  isHovered = computed(() => {
    return this.selectionSvc.hoveredElementId() === 'canvas';
  });

  addContainer() {
    const newLayoutElement = this.modelSvc.writeElementModel(
      'container',
      'canvas'
    );
    console.log(newLayoutElement);
    this.modelSvc.addChildNode('canvas', newLayoutElement);
    setTimeout(() => {
      this.selectionSvc.select(newLayoutElement.data), 0;
    });
    setTimeout(() => {
      this.selectionSvc.select(newLayoutElement.data), 0;
    });
  }

  renderFromModel() {
    this.modelSvc.setCanvasModel([layoutModels[0][0]]);
  }

  private selectionService = inject(SelectionService);
  initialData: string[];
  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }

  ngOnInit(): void {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }

  // readonly defaultBorder = this.stylesService.defaultBorder;
  // readonly dynamicStyles$ = this.stylesService.dynamicStyles$;
  // readonly dynamicBorder$ = this.stylesService.dynamicBorder$;
  // readonly dynamicBorderRadius$ = this.stylesService.strokeRadius$;
  // readonly individualDynamicCornerRadius$ = this.stylesService.individualDynamicCornerRadius$;

  onElementClick(event: MouseEvent) {
    event.stopPropagation();
    let el = event.target as HTMLElement;

    while (
      el &&
      el.tagName &&
      !el.tagName.startsWith('APP-') &&
      el.parentElement
    ) {
      el = el.parentElement;
    }

    if (el && el.tagName.startsWith('APP-')) {
      const componentInstance = (window as any).ng?.getComponent?.(el);

      if (componentInstance) {
        this.selectionService.select(componentInstance.data);
      } else {
        console.warn('ng.getComponent não disponível (modo produção?).');
      }
    }
  }

  customStringify(obj: any, indent = 2): string {
    const noQuoteKeys = new Set([
      'id',
      'parentId',
      'type',
      'data',
      'style',
      'children',
      'text',
      'headerSize',
      'enabler',
      'enableStroke',
      'enableIndividualCorner',
    ]);

    function format(value: any, level: number): string {
      const space = ' '.repeat(level * indent);

      if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        return `[\n${value
          .map((item) => space + ' '.repeat(indent) + format(item, level + 1))
          .join(',\n')}\n${space}]`;
      }

      if (typeof value === 'object' && value !== null) {
        const entries = Object.entries(value);
        if (entries.length === 0) return '{}';

        const formatted = entries.map(([key, val]) => {
          const displayKey = noQuoteKeys.has(key) ? key : `"${key}"`;
          return `${' '.repeat((level + 1) * indent)}${displayKey}: ${format(
            val,
            level + 1
          )}`;
        });

        return `{\n${formatted.join(',\n')}\n${space}}`;
      }

      if (typeof value === 'string') {
        return `"${value}"`;
      }
      return String(value);
    }

    return format(obj, 0);
  }

  onPlusClick() {
    this.selectionSvc.unselect();
  }

  goToRender() {
    this.router.navigate(['/preview'], {
      queryParams: { encoded: this.btoa() },
    });
  }

  onDrop(event: CdkDragDrop<any>) {
    this.dragDropSvc.onDrop(event);
  }

  onDragEntered(event: CdkDragEnter<any, any>) {
    const containerId = event.container.element.nativeElement.getAttribute('data-id');
    const draggedId = event.item.element.nativeElement.getAttribute('data-id');
    console.log(`Entrou no container ${containerId}, item ${draggedId}`);
  }

  onEnter(event: any) {
    console.log('Canvas entered:', event)
  }

  noDrop = computed(() => this.isHovered() && this.dragDropSvc.isDragging() && this.selectionSvc.selectedNode().data.type !== 'container')

}
