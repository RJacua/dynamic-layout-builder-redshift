import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewAreaMenuService } from '../services-yara/new-area-menu.service';
import { LayoutElement, SelectionService } from '../services-yara/selection.service';
import { MenuComponent } from './new-area-menu/menu.component';
import { StylesService } from '../services-yara/styles.service';

@Component({
  selector: 'app-canvas',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MenuComponent,
    MatTooltipModule
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  private selectionService = inject(SelectionService)
  private stylesService = inject(StylesService)
  initialData: string[] = [];
  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }

  readonly defaultBorder = this.stylesService.defaultBorder;
  readonly dynamicStyles$ = this.stylesService.dynamicStyles$;
  readonly dynamicBorder$ = this.stylesService.dynamicBorder$;
  readonly dynamicBorderRadius$ = this.stylesService.dynamicBorderRadius$;
  readonly individualDynamicCornerRadius$ = this.stylesService.individualDynamicCornerRadius$;

  onElementClick(event: MouseEvent, element: LayoutElement) {
    event.stopPropagation();
    this.selectionService.select(element);
  }
  addNewArea() {
    console.log("add new area");
  }

  

}
