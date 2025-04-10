import { Component, inject } from '@angular/core';
import { SelectionService } from '../services-yara/selection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss'
})
export class SidePanelComponent {
  private selectionService = inject(SelectionService)

  selectedElement$ = this.selectionService.selectedElement$;

}
