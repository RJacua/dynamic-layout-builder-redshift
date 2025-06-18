import { Component, computed, effect, inject, OnInit, Signal, signal, untracked } from '@angular/core';
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
  canvas = computed(() => this.modelSvc.canvas());
  canvasString: Signal<string> = computed(
    () => JSON.stringify(this.canvas(), null)
  )
  encodedStr = this.encodeSvc.encodedStr;
  encodedParam = signal<string>('');
  parsedJSON: Signal<Partial<Canvas<CanvasData>>> = signal('');
  isPanning = this.selectionSvc.isPanning;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;
  translateX = 0;
  translateY = 0;
  scale = 1;
  private lastX = 0;
  private lastY = 0;
  offsetX = 0;
  offsetY = 0;
  minScale = 0.3;
  maxScale = 3;
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
    this.modelSvc.setCanvasModel2(model);
    // this.modelSvc.setCanvasModel([layoutModels[0]]);
  }

  onMouseDown(event: MouseEvent) {
    if (event.button === 0 && this.isPanning()) {
      this.isMoving = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      event.preventDefault();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (event.button === 0 && this.isPanning() && this.isMoving) {
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.translateX += dx;
      this.translateY += dy;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
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
    const newScale = this.scale + delta * zoomFactor;
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
  }

  transformStyle() {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  resetView() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

}