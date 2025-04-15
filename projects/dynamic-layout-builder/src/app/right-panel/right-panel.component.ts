import { Component, inject } from '@angular/core';
import { SelectionService } from '../services-yara/selection.service';
import { CommonModule } from '@angular/common';
import { BackgroundStylesOptionsComponent } from './background-styles-options/background-styles-options.component';
import { TextStylesOptionsComponent } from './text-styles-options/text-styles-options.component';
import { BorderStylesOptionsComponent } from './border-styles-options/border-styles-options.component';

@Component({
  selector: 'app-right-panel',
  imports: [
    CommonModule, 
    BackgroundStylesOptionsComponent, 
    TextStylesOptionsComponent,
    BorderStylesOptionsComponent,
  ],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent {
  private selectionService = inject(SelectionService)

  selectedElement$ = this.selectionService.selectedElement$;

}
