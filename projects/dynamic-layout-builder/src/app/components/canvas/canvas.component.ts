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
  signal,
  WritableSignal,
  ElementRef,
  AfterViewInit,
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
  AtomicElementData,
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
import { EncodeService } from '../../services/encode.service';
import { PanningService } from '../../services/panning.service';
import { UndoRedoService } from '../../services/functionalities/undo-redo.service';

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
export class CanvasComponent implements LayoutElement<CanvasData>, OnInit, AfterViewInit {
  // @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  @ViewChild('core', { static: true }) coreRef!: ElementRef<HTMLDivElement>;
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contentRoot', { static: true }) contentRootRef!: ElementRef<HTMLDivElement>;

  private _elementRef = inject(ElementRef);

  @Input() data: CanvasData = { id: 'canvas', type: 'canvas', children: [], expandedNodes: new Set([]), style: {}, enabler: {} };
  @Input() editMode: boolean = true;
  @Input() baseWidth = 1920;
  @Input() baseHeight = 1080;

  @Input() fitTarget: 'content' | 'artboard' = 'content';
  @Input() fitStrategy: 'contain' | 'cover' | 'fitWidth' | 'fitHeight' = 'fitWidth';
  @Input() alignX: 'left' | 'center' | 'right' = 'left';
  @Input() alignY: 'top' | 'center' | 'bottom' = 'top';

  scale = signal(1);
  baseX = signal(0);  // translate X calculado pelo fit
  baseY = signal(0);  // translate Y calculado pelo fit
  spacerW = signal(0);  // só usado no preview
  spacerH = signal(0);

  // Pan vindo do serviço (adapte os nomes se diferirem)
  panX = computed(() => {
    if (!this.editMode) return 0;
    const raw = this.panningSvc.offsetX?.() ?? 0;
    // limites: left/top = 0; right/bottom = (viewport - mundo) (valor negativo)
    const min = Math.min(0, this.viewW() - this.worldW()); // <= 0
    const max = 0;
    return Math.max(min, Math.min(raw, max));
  });

  panY = computed(() => {
    if (!this.editMode) return 0;
    const raw = this.panningSvc.offsetY?.() ?? 0;
    const min = Math.min(0, this.viewH() - this.worldH()); // <= 0
    const max = 0;
    return Math.max(min, Math.min(raw, max));
  });

  // tamanho visível (viewport)
  private viewW = signal(0);
  private viewH = signal(0);

  // tamanho do conteúdo escalado (mundo)
  private worldW = signal(0);
  private worldH = signal(0);

  width = signal(0);
  height = signal(0);

  private viewportRO?: ResizeObserver;
  private contentRO?: ResizeObserver;

  private windowResizeHandler = () => this.onWindowResize();

  private dprMql?: MediaQueryList;
  private dprListener?: (e: MediaQueryListEvent) => void;

  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();

    effect(() => {
      // console.log("canvas no canvas: ", this.canvas())
      const element = this._elementRef.nativeElement.querySelector('#core');

      if (element) {
        this.resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const rect = entry.contentRect;
            this.width.set(rect.width);
            this.height.set(rect.height);
          }
        });

        this.resizeObserver.observe(element);
      }

      const node = this.nodeSignal();

      // this.width.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().width);
      // this.height.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().height);

      // console.log("w: ", this.width(),"h: ", this.height())
      // const canvasModel = this.modelSvc.hasCanvasModelChanged();

      untracked(() => {
        if (node) {
          // IMPORTANTE: passe dimensões BASE (não escaladas) para o processamento de estilo
          this.componentsSvc.processComponentStyle(
            this.nodeSignal(),
            this.dynamicStyle,
            this.internalStyle,
            this.externalStyle,
            this.baseWidth,
            this.baseHeight
          );
        }
      });
    })
  }

  readonly generalSvc = inject(GeneralFunctionsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly router = inject(Router);
  readonly componentsSvc = inject(ComponentsService);
  readonly dragDropSvc = inject(DragDropService);
  readonly dialog = inject(MatDialog);
  readonly encodeSvc = inject(EncodeService);

  readonly panningSvc = inject(PanningService);

  readonly undoRedoSvc = inject(UndoRedoService);

  id: string = '0';
  canvas = computed(() => this.modelSvc.canvas());
  children = signal(
    [] as (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  );
  onlyContainers = computed(() =>
    this.canvas().data.children.filter((el) => el.data.type === 'container')
  );
  // canvasModelsString: Signal<string> = computed(
  //   () => JSON.stringify(this.canvas().data.children, null)
  //   // () => this.customStringify(this.canvasModel())
  // );

  canvasString: Signal<string> = computed(
    () => JSON.stringify(this.canvas(), null)
    // () => this.customStringify(this.canvasModel())
  );

  canvasCustomString: Signal<string> = computed(
    // () => JSON.stringify(this.canvasModel(), null)
    () => this.generalSvc.customStringify(this.canvas())
  )

  nodeSignal: any;
  dynamicStyle: WritableSignal<any> = signal(null);
  internalStyle: WritableSignal<any> = signal(null);
  externalStyle: WritableSignal<any> = signal(null);


  private resizeObserver?: ResizeObserver;


  encoded = computed(() => this.encodeSvc.encodedStr());
  decoded = computed(() => this.encodeSvc.decodedStr());

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
    // console.log(newLayoutElement);
    this.modelSvc.addChildNode('canvas', newLayoutElement);
    setTimeout(() => {
      this.selectionSvc.select(newLayoutElement.data), 0;
    });
    setTimeout(() => {
      this.selectionSvc.select(newLayoutElement.data), 0;
    });
  }

  // renderFromModel() {
  //   this.modelSvc.setCanvasModel([layoutModels[0][0]]);
  // }

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportModelDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  private selectionService = inject(SelectionService);
  initialData: string[];

  ngOnInit(): void {
    this.id = this.data.id;
    this.children.set(this.data.children ?? []);

    this.nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));

    this.modelSvc.updateModel(this.id, this.nodeSignal());

    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }


  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.viewportRO?.disconnect();
    this.contentRO?.disconnect();

    window.removeEventListener('resize', this.windowResizeHandler);
    if (this.dprMql && this.dprListener) {
      this.dprMql.removeEventListener('change', this.dprListener);
    }
  }

  ngAfterViewInit() {
    this.width.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().width);
    this.height.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().height);

    this.componentsSvc.processComponentStyle(this.nodeSignal(), this.dynamicStyle, this.internalStyle, this.externalStyle, this.width(), this.height());

    this.viewportRO = new ResizeObserver(() => this.reflow());
    this.viewportRO.observe(this.viewportRef.nativeElement);

    this.contentRO = new ResizeObserver(() => this.reflow());
    this.contentRO.observe(this.contentRootRef.nativeElement);

    this.reflow();

    window.addEventListener('resize', this.windowResizeHandler);
    this.setupDprListener();


  }
  // onElementClick(event: MouseEvent) {
  //   event.stopPropagation();
  //   let el = event.target as HTMLElement;
  //   let originalEl = event.target as HTMLElement;

  //   while (
  //     el &&
  //     el.tagName &&
  //     !el.tagName.startsWith('APP-') &&
  //     // el.id !== "core" &&
  //     el.parentElement
  //   ) {
  //     // console.log(el.classList)
  //     el = el.parentElement;
  //   }

  //   if (el && el.tagName.startsWith('APP-CANVAS')) {
  //     this.selectionSvc.selectCanvas();
  //   }
  //   else if (el && el.tagName.startsWith('APP-')) {
  //     const componentInstance = (window as any).ng?.getComponent?.(el);

  //     if (componentInstance) {
  //       let data = componentInstance.data;

  //       if (originalEl.classList.contains("external")) {
  //         this.selectionService.selectById(data.parentId, true);
  //       }
  //       else {
  //         this.selectionService.select(componentInstance.data);
  //       }

  //     } else {
  //       console.warn('ng.getComponent não disponível (modo produção?).');
  //     }
  //   }
  // }

  onElementClick(event: MouseEvent) {
    event.stopPropagation();

    // sobe na árvore até achar algo com [data-id]
    const hit = (event.target as HTMLElement).closest('[data-id]') as HTMLElement | null;

    // clique “no vazio” → seleciona canvas
    if (!hit) {
      this.selectionSvc.selectCanvas();
      return;
    }

    const id = hit.dataset['id'];
    if (!id) {
      this.selectionSvc.selectCanvas();
      return;
    }

    // regra especial: se clicou numa borda externa, selecione o pai
    const original = event.target as HTMLElement;
    if (original.classList.contains('external')) {
      const node = this.modelSvc.getNodeById(id);
      const parentId = node?.data?.parentId;
      if (parentId) {
        this.selectionSvc.selectById(parentId, true);
        return;
      }
    }

    this.selectionSvc.selectById(id, true);
  }

  onPlusClick() {
    this.selectionSvc.unselect();
  }

  goToRender() {
    this.router.navigate(['/preview'], {
      fragment: this.encoded()
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

  private reflow() {
    if (this.editMode) {
      this.ensureViewportForEdit();
      this.fitEditNoScroll();
    } else {
      this.clearViewportSizeForPreview();
      this.fitPreviewWithScroll();
    }
  }



  // private fitPreviewWithScroll() {

  //   const viewport = this.viewportRef.nativeElement.getBoundingClientRect();
  //   const artEl = this.coreRef.nativeElement;
  //   const contEl = this.contentRootRef.nativeElement;

  //   const sPrev = this.scale() || 1;
  //   const art = artEl.getBoundingClientRect();
  //   const cont = contEl.getBoundingClientRect();

  //   const cx = (cont.left - art.left) / sPrev;
  //   const cy = (cont.top - art.top) / sPrev;
  //   const cw = cont.width / sPrev;
  //   const ch = cont.height / sPrev;

  //   const s = viewport.width / cw;
  //   this.scale.set(s);

  //   this.baseX.set(-s * cx);
  //   this.baseY.set(-s * cy);

  //   const scaledW = s * cw;
  //   const scaledH = s * ch;

  //   this.viewW.set(viewport.width);
  //   this.viewH.set(viewport.height);
  //   this.worldW.set(scaledW);
  //   this.worldH.set(scaledH);

  //   // sem scroll horizontal; vertical se precisar
  //   this.spacerW.set(viewport.width);
  //   this.spacerH.set(Math.max(viewport.height, scaledH));

  //   this.baseX.set(-s * cx);            // cola no topo-esquerda do conteúdo
  //   this.baseY.set(-s * cy);

  //   this.spacerW.set(viewport.width);                 // sem scroll horizontal
  //   this.spacerH.set(Math.max(viewport.height, scaledH)); // scroll vertical se precisar
  // }

  // /** Edit mode: sem scroll (overflow hidden); panning move a view */
  // private fitEditNoScroll() {
  //   const viewport = this.viewportRef.nativeElement.getBoundingClientRect();
  //   const artEl = this.coreRef.nativeElement;
  //   const contEl = this.contentRootRef.nativeElement;

  //   const sPrev = this.scale() || 1;
  //   const art = artEl.getBoundingClientRect();
  //   const cont = contEl.getBoundingClientRect();

  //   const cx = (cont.left - art.left) / sPrev;
  //   const cy = (cont.top - art.top) / sPrev;
  //   const cw = cont.width / sPrev;
  //   const ch = cont.height / sPrev;

  //   const s = viewport.width / cw;  // mesmo fit da preview
  //   this.scale.set(s);

  //   // top-left do conteúdo em (0,0)
  //   this.baseX.set(-s * cx);
  //   this.baseY.set(-s * cy);

  //   // atualiza mundo/viewport para o clamp do pan
  //   const scaledW = s * cw;
  //   const scaledH = s * ch;
  //   this.viewW.set(viewport.width);
  //   this.viewH.set(viewport.height);
  //   this.worldW.set(scaledW);
  //   this.worldH.set(scaledH);

  //   // sem spacer no edit mode
  //   this.spacerW.set(0);
  //   this.spacerH.set(0);

  //   // (opcional) se o seu PanningService aceitar limites, atualize:
  //   try {
  //     const minX = Math.min(0, this.viewW() - this.worldW());
  //     const minY = Math.min(0, this.viewH() - this.worldH());
  //     // use o método que você tiver disponível; exemplos comuns:
  //     // this.panningSvc.setBounds?.({ minX, maxX: 0, minY, maxY: 0 });
  //     // this.panningSvc.setLimits?.(minX, 0, minY, 0);
  //   } catch { }

  // }

  /** Preview: fit pela largura, sem corte — usa spacer para scroll vertical */
  /** Preview: fit pela largura, 1 scroll vertical quando necessário (sem cauda) */
  private fitPreviewWithScroll() {
    const vpRect = this.viewportRef.nativeElement.getBoundingClientRect();

    // Mede conteúdo lógico (independe de escala)
    const { x, y, w, h } = this.measureContentLogical();

    // Escala: preencher pela largura (idêntico HD/4K)
    const s = w > 0 ? (vpRect.width / w) : 1;
    this.scale.set(s);

    // Alinha top-left do conteúdo em (0,0)
    this.baseX.set(-s * x);
    this.baseY.set(-s * y);

    // Tamanhos escalados (mundo)
    const scaledW = s * w;
    const scaledH = s * h;

    this.viewW.set(vpRect.width);
    this.viewH.set(vpRect.height);
    this.worldW.set(scaledW);
    this.worldH.set(scaledH);

    // Spacer EXATO da altura do conteúdo (arredondado) → evita “cauda”
    this.spacerW.set(vpRect.width);
    this.spacerH.set(Math.ceil(scaledH));

    // Se usuário estava no fim e a altura diminuiu (4K → HD), corrige scrollTop
    const vpEl = this.viewportRef.nativeElement;
    requestAnimationFrame(() => {
      const maxScrollTop = Math.max(0, this.spacerH() - vpEl.clientHeight);
      if (vpEl.scrollTop > maxScrollTop) vpEl.scrollTop = maxScrollTop;
    });
  }

  /** Edit mode: sem scroll; panning cobre tudo (cresce com conteúdo real) */
  private fitEditNoScroll() {
    const vpRect = this.viewportRef.nativeElement.getBoundingClientRect();

    // Mede conteúdo lógico (independe de escala)
    const { x, y, w, h } = this.measureContentLogical();

    // Mesma regra do preview (fit-width) para ficar visualmente idêntico
    const s = w > 0 ? (vpRect.width / w) : 1;
    this.scale.set(s);

    // Base na origem do conteúdo; navegação via pan
    this.baseX.set(-s * x);
    this.baseY.set(-s * y);

    // Mundo/Viewport para clamp do pan
    const scaledW = s * w;
    const scaledH = s * h;
    this.viewW.set(vpRect.width);
    this.viewH.set(vpRect.height);
    this.worldW.set(Math.ceil(scaledW));
    this.worldH.set(Math.ceil(scaledH));

    // Sem spacer no edit mode
    this.spacerW.set(0);
    this.spacerH.set(0);

    // (Opcional) Avisar limites ao PanningService, se houver API:
    // const minX = Math.min(0, this.viewW() - this.worldW());
    // const minY = Math.min(0, this.viewH() - this.worldH());
    // this.panningSvc.setBounds?.({ minX, maxX: 0, minY, maxY: 0 });
  }



  private ensureViewportForEdit() {
    const vp = this.viewportRef?.nativeElement as HTMLElement | undefined;
    if (!vp) return;

    vp.style.overflow = 'hidden';

    const parent = vp.parentElement as HTMLElement | null;
    const h = parent?.clientHeight || window.innerHeight;
    const w = parent?.clientWidth || window.innerWidth;

    // aplica sempre no editor: evita colapsos intermitentes
    vp.style.height = `${h}px`;
    vp.style.width = `${w}px`;
  }


  /** Limpa estilos forçados no preview (deixa o spacer controlar o scroll) */
  private clearViewportSizeForPreview() {
    const vp = this.viewportRef?.nativeElement as HTMLElement | undefined;
    if (!vp) return;
    vp.style.overflow = 'auto';
    vp.style.height = '';
    vp.style.width = '';
  }

  /** Listener robusto para monitor swap / DPR change */
  private setupDprListener() {
    try {
      // remove anterior, se existir
      if (this.dprMql && this.dprListener) {
        this.dprMql.removeEventListener('change', this.dprListener);
      }
      this.dprMql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.dprListener = () => {
        // re-registra para o novo DPR e força reflow
        this.setupDprListener();
        this.reflow();
      };
      this.dprMql.addEventListener('change', this.dprListener);
    } catch { /* alguns browsers antigos não suportam */ }
  }

  private onWindowResize() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.reflow());
    });
  }


  /** Lê a escala atual aplicada ao #core a partir da CSS transform matrix (fallback = 1) */
  private readCurrentScale(): number {
    const el = this.coreRef?.nativeElement;
    if (!el) return 1;
    const t = getComputedStyle(el).transform;
    if (!t || t === 'none') return 1;
    // matrix(a,b,c,d,tx,ty) → scaleX ~ a
    const m = t.match(/matrix\(([^)]+)\)/);
    if (!m) return 1;
    const parts = m[1].split(',').map(v => parseFloat(v));
    const a = parts[0];
    const d = parts[3];
    // se houver skew, pega média de scaleX/scaleY
    const sx = isFinite(a) ? Math.abs(a) : 1;
    const sy = isFinite(d) ? Math.abs(d) : sx;
    return (sx + sy) / 2;
  }

  /** Mede o bbox lógico do conteúdo.
   *  1) tenta scrollWidth/scrollHeight (lógico, independe de escala),
   *  2) se falhar/der 0, calcula pelo boundingClientRect dos filhos convertendo pela escala atual.
   */
  private measureContentLogical(): { x: number; y: number; w: number; h: number } {
    const root = this.contentRootRef?.nativeElement as HTMLElement | undefined;
    const core = this.coreRef?.nativeElement as HTMLElement | undefined;
    if (!root || !core) return { x: 0, y: 0, w: this.baseWidth, h: this.baseHeight };

    // 1) primeiro tenta layout normal (fluxo)
    const w1 = root.scrollWidth;
    const h1 = root.scrollHeight;
    if (w1 > 0 && h1 > 0) return { x: 0, y: 0, w: w1, h: h1 };

    // 2) fallback: inspecta filhos (inclui posições absolutas/transform)
    const sNow = this.readCurrentScale();
    const coreRect = core.getBoundingClientRect();

    let minL = Number.POSITIVE_INFINITY;
    let minT = Number.POSITIVE_INFINITY;
    let maxR = Number.NEGATIVE_INFINITY;
    let maxB = Number.NEGATIVE_INFINITY;

    const children = Array.from(root.children) as HTMLElement[];
    if (children.length === 0) {
      return { x: 0, y: 0, w: this.baseWidth, h: this.baseHeight };
    }

    for (const child of children) {
      const r = child.getBoundingClientRect();
      // converte do espaço escalado (tela) pro lógico (antes da escala)
      const l = (r.left - coreRect.left) / sNow;
      const t = (r.top - coreRect.top) / sNow;
      const rr = (r.right - coreRect.left) / sNow;
      const bb = (r.bottom - coreRect.top) / sNow;
      minL = Math.min(minL, l);
      minT = Math.min(minT, t);
      maxR = Math.max(maxR, rr);
      maxB = Math.max(maxB, bb);
    }

    if (!isFinite(minL) || !isFinite(minT) || !isFinite(maxR) || !isFinite(maxB)) {
      return { x: 0, y: 0, w: this.baseWidth, h: this.baseHeight };
    }
    const w = Math.max(0, maxR - minL);
    const h = Math.max(0, maxB - minT);
    const x = Math.max(0, minL);
    const y = Math.max(0, minT);
    return { x, y, w: w || this.baseWidth, h: h || this.baseHeight };
  }



}

