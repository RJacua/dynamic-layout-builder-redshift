import { Component, computed, effect, inject, OnInit, Signal, signal, untracked } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CanvasComponent } from "../../components/canvas/canvas.component";
import { RightPanelComponent } from "../../right-panel/right-panel.component";
import { LeftPanelComponent } from '../../left-panel/left-panel.component';
import { AngularSplitModule } from 'angular-split';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { ContainerData, LayoutElement } from '../../interfaces/layout-elements';
import { EncodeService } from '../../services/encode.service';
import { SelectionService } from '../../services/selection.service';
import { HotkeyService } from '../../services/hotkey.service';
import { PanningService } from '../../services/panning.service';

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
  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null)
  )
  encodedStr = this.encodeSvc.encodedStr;
  encodedParam = signal<string>('');
  parsedJSON: Signal<LayoutElement<ContainerData>[]> = signal([]);
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
      this.canvasModel();
      untracked(() => {
        this.updateQueryParam('encoded', this.encodedStr())
      })
    });
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      if (params['encoded']) {
        this.encodedParam.set(params['encoded']);
        this.parsedJSON = computed(() => JSON.parse(this.encodeSvc.decoder(this.encodedParam)))
        this.renderFromModel(this.parsedJSON());
      }
    });
  }

  updateQueryParam(key: string, value: string | null) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        [key]: value
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  renderFromModel(model: LayoutElement<ContainerData>[]) {
    this.modelSvc.resetCanvasModel();
    this.modelSvc.setCanvasModel(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }

  onMouseDown(event: MouseEvent) {
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

  resetView() {
    this.panningSvc.resetView();
  }

}