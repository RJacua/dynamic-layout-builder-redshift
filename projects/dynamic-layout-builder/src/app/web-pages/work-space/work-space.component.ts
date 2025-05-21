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

  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null)
  )
  
  encodedStr = this.encodeSvc.encodedStr;
  encodedParam = signal<string>('');
  parsedJSON: Signal<LayoutElement<ContainerData>[]> = signal([]);

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
}
