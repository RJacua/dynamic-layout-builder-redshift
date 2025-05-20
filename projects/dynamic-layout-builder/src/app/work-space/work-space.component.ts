import { Component, computed, effect, inject, OnInit, Signal, signal, untracked } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CanvasComponent } from "../canvas/canvas.component";
import { RightPanelComponent } from "../right-panel/right-panel.component";
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { AngularSplitModule } from 'angular-split';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../services/model.service';
import { ContainerData, LayoutElement } from '../interfaces/layout-elements';

@Component({
  selector: 'app-work-space',
  imports: [MatSidenavModule, CanvasComponent, RightPanelComponent, LeftPanelComponent, AngularSplitModule],
  templateUrl: './work-space.component.html',
  styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly modelSvc = inject(ModelService);

  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null)
  )

  utf8Str: Signal<string> = computed(() => encodeURIComponent(this.canvasModelsString()));
  btoa: Signal<string> = computed(() => btoa(this.utf8Str()));
  atob: Signal<string> = computed(() => atob(this.btoa()));
  decoded: Signal<string> = computed(() => decodeURIComponent(this.atob()));
  parsed: Signal<LayoutElement<ContainerData>[]> = signal([]);

  encoded = signal('')

  constructor() {

    effect(() => {
      const canvasModel = this.canvasModel();

      untracked(() => {
        this.updateQueryParam('encoded', this.btoa())
      })

    });

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['encoded']) {
        this.encoded.set(params['encoded']);
        var decodedStr = decodeURIComponent(atob(this.encoded()));
        this.renderFromModel(JSON.parse(decodedStr));
        this.parsed = computed(() => JSON.parse(this.decoded()));
      }
      this.renderFromModel(this.parsed());
    });
  }

  updateQueryParam(key: string, value: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
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
}
