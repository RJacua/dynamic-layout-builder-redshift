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
import { HotkeyService } from '../../services/functionalities/hotkey.service';
import { PanningService } from '../../services/panning.service';
import { UndoRedoService } from '../../services/functionalities/undo-redo.service';
import { BannerComponent } from "../../components/banner/banner.component";
import { BannerService } from '../../services/banner.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-work-space',
  imports: [MatSidenavModule, CanvasComponent, RightPanelComponent, LeftPanelComponent, AngularSplitModule, BannerComponent, CommonModule],
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
  readonly bannerSvc = inject(BannerService);
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
      this.canvas();
      untracked(() => {
        this.updateFragment(this.encodeSvc.encodedStr());
      });
    });

    effect(() => {
      this.panningSvc.fullViewFlag();
      this.fullView();
    });

    effect(() => {
      this.panningSvc.fitViewFlag();
      if (this.viewportRef?.nativeElement) {
        const coreEl = this.canvasWrapperRef.nativeElement.querySelector('#core');
        if (coreEl) {
          this.panningSvc.fitView(this.viewportRef.nativeElement, coreEl);
        }

      }
    });



  }

  ngOnInit(): void {
     this.panningSvc.initKeyboardShortcuts();

    this.activeRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.encodedParam.set(fragment);
        try {
          this.parsedJSON = computed(() =>
            JSON.parse(this.encodeSvc.decoder(this.encodedParam))
          );
          this.renderFromModel(this.parsedJSON() as Canvas<CanvasData>);
        } catch (error) {
          console.error("Erro ao decodificar fragmento", error);
        }
      }
    });
  }

    ngOnDestroy(): void {
    // remove listeners globais com segurança
    this.panningSvc.destroyKeyboardShortcuts();
  }


  // updateQueryParam(key: string, value: string | null) {
  //   // console.log("to funcionando sim")
  //   this.router.navigate([], {
  //     relativeTo: this.activeRoute,
  //     queryParams: {
  //       [key]: value
  //     },
  //     queryParamsHandling: 'merge',
  //     replaceUrl: true
  //   });
  // }

  updateFragment(value: string | null) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      fragment: value ?? undefined,
      replaceUrl: true
    });
  }


  renderFromModel(model: Canvas<CanvasData>) {
    this.modelSvc.setCanvasModel(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }

  onClick() {
    this.selectionSvc.selectCanvas();
  }
  onMouseDown(event: MouseEvent) {
    console.log("aaa");
    if ((event.button === 0 && this.isPanning()) || event.button === 1) {
      this.selectionSvc.unselect();
      // this.isPanning.set(true);
      this.lastX.set(event.clientX);
      this.lastY.set(event.clientY);

      console.log("X: ", this.lastX(), "; Y: ", this.lastY());
      event.preventDefault();
    }
  }

  

  onMouseMove(event: MouseEvent) {
    const isLeftWithPanning = (event.buttons & 1) && this.isPanning();
    const isMiddle = event.buttons & 4;

    if ((isLeftWithPanning || isMiddle) && this.isPanning()) {
      const dx = event.clientX - this.lastX();
      const dy = event.clientY - this.lastY();
      this.translateX.update(() => this.translateX() + dx);
      this.translateY.update(() => this.translateY() + dy);
      this.lastX.set(event.clientX);
      this.lastY.set(event.clientY);
    }
  }

  onMouseUp() {
    // this.isPanning.set(false);
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

}