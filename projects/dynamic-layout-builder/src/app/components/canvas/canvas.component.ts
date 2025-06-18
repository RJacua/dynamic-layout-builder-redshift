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
  CanvasData,
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
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportModelDialogComponent } from '../export-model-dialog/export-model-dialog.component';
import { ExportImportService } from '../../services/export-import.service';

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
  @Input() data: CanvasData = { id: 'canvas', type: 'canvas', children: [], expandedNodes: new Set([]), style: {} };
  @Input() editMode: boolean = true;

  readonly generalSvc = inject(GeneralFunctionsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly router = inject(Router);

  readonly dragDropSvc = inject(DragDropService);

  readonly dialog = inject(MatDialog);

  readonly importSvc = inject(ExportImportService);

  canvas = computed(() => this.modelSvc.canvas());

  onlyContainers = computed(() =>
    this.canvas().data.children.filter((el) => el.data.type === 'container')
  );
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvas().data.children, null)
    // () => this.customStringify(this.canvasModel())
  );

  canvasCustomString: Signal<string> = computed(
    // () => JSON.stringify(this.canvasModel(), null)
    () => this.generalSvc.customStringify(this.canvas().data.children)
  )

  utf8Str: Signal<string> = computed(() =>
    encodeURIComponent(this.canvasModelsString())
  );
  btoa: Signal<string> = computed(() => btoa(this.utf8Str()));
  atob: Signal<string> = computed(() => atob(this.btoa()));
  decoded: Signal<string> = computed(() => decodeURIComponent(this.atob()));

  isPanning = this.selectionSvc.isPanning;
  isHovered = computed(() => {
    return this.selectionSvc.hoveredElementId() === 'canvas';
  });

  addContainer() {
    if (this.isPanning()) return;

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

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportModelDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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
    let originalEl = event.target as HTMLElement;

    while (
      el &&
      el.tagName &&
      !el.tagName.startsWith('APP-') &&
      // el.id !== "core" &&
      el.parentElement
    ) {
      console.log(el.classList)
      el = el.parentElement;
    }

    if (el && el.tagName.startsWith('APP-')) {
      const componentInstance = (window as any).ng?.getComponent?.(el);

      if (componentInstance) {
        let data = componentInstance.data;

        if (originalEl.classList.contains("external")) {
          this.selectionService.selectById(data.parentId, true);
        }
        else {
          this.selectionService.select(componentInstance.data);
        }

      } else {
        console.warn('ng.getComponent não disponível (modo produção?).');
      }
    }
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

  noDrop = computed(() => this.isHovered() && this.dragDropSvc.isDragging() && this.selectionSvc.selectedNode().data.type !== 'container');

  importModel() {
    this.importSvc.importModel();
  }

}
