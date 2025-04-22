import { CommonModule } from '@angular/common';
import { Component, inject, computed, effect, Signal, untracked, ViewChild, ViewContainerRef } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { NewAreaMenuService } from '../services-yara/new-area-menu.service';
import { SelectionService } from '../services-yara/selection.service';
import { MenuComponent } from './new-area-menu/menu.component';
import { StylesService } from '../services-yara/styles.service';
import { ContainerComponent } from "../container/container.component";
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { HeaderComponent } from "../header/header.component";
import { ContainerData, LayoutElement } from '../interfaces/layout-elements';
import { layoutModels } from '../model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    CommonModule, 
    ContainerComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MenuComponent,
    MatTooltipModule
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  providers: []
})

export class CanvasComponent {
  @ViewChild('containerDiv', { read: ViewContainerRef }) containerDiv!: ViewContainerRef;
  readonly modelSvc = inject(ModelService);

  canvasModel = computed(() => this.modelSvc.canvasModel());
  canvasModelsString: Signal<string> = computed(
    () => JSON.stringify(this.canvasModel(), null, 2)
  )

  addContainer() {
    const newContainer = this.modelSvc.writeElementModel('container', 'canvas');
    this.modelSvc.addChildNode('canvas', newContainer);
  }

  renderFromModel() {
    this.modelSvc.setCanvasModel([layoutModels[2]]);
  }

  private selectionService = inject(SelectionService)
  private stylesService = inject(StylesService)
  initialData: string[] = [];
  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }

  // readonly defaultBorder = this.stylesService.defaultBorder;
  readonly dynamicStyles$ = this.stylesService.dynamicStyles$;
  // readonly dynamicBorder$ = this.stylesService.dynamicBorder$;
  // readonly dynamicBorderRadius$ = this.stylesService.strokeRadius$;
  // readonly individualDynamicCornerRadius$ = this.stylesService.individualDynamicCornerRadius$;

  onElementClick(event: MouseEvent, element: LayoutElement<any>) {
    event.stopPropagation();
    this.selectionService.select(element);
  }

  

}
