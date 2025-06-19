import { Component, computed, effect, ElementRef, inject, OnInit, Signal, signal, untracked, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CanvasComponent } from "../../components/canvas/canvas.component";
import { RightPanelComponent } from "../../right-panel/right-panel.component";
import { LeftPanelComponent } from '../../left-panel/left-panel.component';
import { AngularSplitModule } from 'angular-split';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { Canvas, CanvasData, ContainerData, LayoutElement } from '../../interfaces/layout-elements';
import { EncodeService } from '../../services/encode.service';
import { SelectionService } from '../../services/selection.service';
import { HotkeyService } from '../../services/hotkey.service';
import { PanningService } from '../../services/panning.service';
import { UndoRedoService } from '../../services/undo-redo.service';

@Component({
  selector: 'app-work-space',
  imports: [MatSidenavModule, CanvasComponent, RightPanelComponent, LeftPanelComponent, AngularSplitModule],
  templateUrl: './work-space.component.html',
  styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  readonly encodeSvc = inject(EncodeService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly hotkeySvc = inject(HotkeyService);
  readonly panningSvc = inject(PanningService);
  readonly undoRedoSvc = inject(UndoRedoService);
  canvas = computed(() => this.modelSvc.canvas());
  canvasString: Signal<string> = computed(
    () => JSON.stringify(this.canvas(), null)
  )
  encodedStr = this.encodeSvc.encodedStr;
  encodedParam = signal<string>('');
  parsedJSON: Signal<Partial<Canvas<CanvasData>>> = signal('');

  @ViewChild('panZoomContainer', { static: true }) panZoomContainerRef!: ElementRef;
  @ViewChild('canvasWrapper', { static: true }) canvasWrapperRef!: ElementRef;
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef;

  isPanning = this.selectionSvc.isPanning;
  startX = this.panningSvc.startX;
  startY = this.panningSvc.startY;
  scrollLeft = this.panningSvc.scrollLeft;
  scrollTop = this.panningSvc.scrollTop;
  translateX = this.panningSvc.translateX;
  translateY = this.panningSvc.translateY;
  scale = this.panningSvc.scale;
  lastX = this.panningSvc.lastX;
  lastY = this.panningSvc.lastY;
  offsetX = this.panningSvc.offsetX;
  offsetY = this.panningSvc.offsetY;
  minScale = this.panningSvc.minScale;
  maxScale = this.panningSvc.maxScale;
  isMoving = false;

  constructor() {

    effect(() => {
      // console.log("canvas ws: ", this.canvas());
      // console.log("decoded ws: ", this.encodeSvc.decodedStr());
      this.canvas();
      untracked(() => {
        this.updateQueryParam('encoded', this.encodeSvc.encodedStr())
      })
    });

    effect(() => {
      this.panningSvc.fullViewFlag();
      this.fullView();
    })
    
    effect(() => {
      this.panningSvc.fitViewFlag();
      this.fitView();
    })

  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      if (params['encoded']) {
        this.encodedParam.set(params['encoded']);
        this.parsedJSON = computed(() => JSON.parse(this.encodeSvc.decoder(this.encodedParam)));
        // console.log("parsed: ", this.parsedJSON())
        this.renderFromModel(this.parsedJSON() as Canvas<CanvasData>);
      }
    });
  }

  updateQueryParam(key: string, value: string | null) {
    // console.log("to funcionando sim")
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        [key]: value
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  renderFromModel(model: Canvas<CanvasData>) {
    this.modelSvc.setCanvasModel(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }

  onMouseDown(event: MouseEvent) {
    this.selectionSvc.unselect();
    if (event.button === 0 && this.isPanning()) {
      this.isMoving = true;
      this.lastX.set(event.clientX);
      this.lastY.set(event.clientY);
      event.preventDefault();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (event.button === 0 && this.isPanning() && this.isMoving) {
      const dx = event.clientX - this.lastX();
      const dy = event.clientY - this.lastY();
      this.translateX.update(() => this.translateX() + dx);
      this.translateY.update(() => this.translateY() + dy);
      this.lastX.set(event.clientX);
      this.lastY.set(event.clientY);
    }
  }

  onMouseUp() {
    this.isMoving = false;
  }

  onWheel(event: WheelEvent) {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const delta = -event.deltaY;
    const zoomFactor = 0.001;
    const newScale = this.scale() + delta * zoomFactor;
    this.scale.set(Math.min(this.maxScale(), Math.max(this.minScale(), newScale)));

    console.log(this.scale());
  }

  transformStyle() {
    return `translate(${this.translateX()}px, ${this.translateY()}px) scale(${this.scale()})`;
  }

  fullView() {
    this.panningSvc.fullView();
  }

  fitView() {
    const viewportEl = this.viewportRef.nativeElement as HTMLElement;
    const canvasEl = this.canvasWrapperRef.nativeElement as HTMLElement;

    const viewportWidth = viewportEl.clientWidth;
    const viewportHeight = viewportEl.clientHeight;

    const canvasWidth = canvasEl.scrollWidth;
    const canvasHeight = canvasEl.scrollHeight;

    if (!canvasWidth || !canvasHeight) return;

    // Calcular o scale que encaixa no viewport (mantendo proporção)
    const scaleX = viewportWidth / canvasWidth;
    const scaleY = viewportHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY, this.maxScale());

    // Atualizar no serviço
    this.scale.set(scale);

    // Centralizar o canvas visualmente
    const offsetX = (viewportWidth - canvasWidth * scale) / 2;
    const offsetY = (viewportHeight - canvasHeight * scale) / 2;

    this.translateX.set(offsetX);
    this.translateY.set(offsetY);
  }

}