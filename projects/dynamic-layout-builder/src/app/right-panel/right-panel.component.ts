import { Component, inject } from '@angular/core';
import { SelectionService } from '../services/selection.service';
import { CommonModule } from '@angular/common';
import { BackgroundStylesOptionsComponent } from './background-styles-options/background-styles-options.component';
import { TextStylesOptionsComponent } from './text-styles-options/text-styles-options.component';
import { BorderStylesOptionsComponent } from './border-styles-options/border-styles-options.component';
import { CornerStylesOptionsComponent } from './corner-styles-options/corner-styles-options.component';
import { PaddingStylesOptionsComponent } from './padding-styles-options/padding-styles-options.component';
import { MarginStylesOptionsComponent } from "./margin-styles-options/margin-styles-options.component";
import { IframeBasicOptionsComponent } from './iframe-basic-options/iframe-basic-options.component';

@Component({
  selector: 'app-right-panel',
  imports: [
    CommonModule,
    BackgroundStylesOptionsComponent,
    TextStylesOptionsComponent,
    BorderStylesOptionsComponent,
    CornerStylesOptionsComponent,
    PaddingStylesOptionsComponent,
    MarginStylesOptionsComponent,
    IframeBasicOptionsComponent
],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent {
  private selectionService = inject(SelectionService)

  selectedNode = this.selectionService.selectedNode;

}
