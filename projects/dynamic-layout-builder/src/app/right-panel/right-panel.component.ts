import { Component, inject } from '@angular/core';
import { SelectionService } from '../services-yara/selection.service';
import { CommonModule } from '@angular/common';
import { GeneralOptionsComponent } from './general-options/general-options.component';

@Component({
  selector: 'app-right-panel',
  imports: [CommonModule, GeneralOptionsComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent {
  private selectionService = inject(SelectionService)

  selectedElement$ = this.selectionService.selectedElement$;

}
