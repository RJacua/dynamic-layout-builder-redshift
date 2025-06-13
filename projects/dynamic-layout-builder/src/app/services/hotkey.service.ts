import { Injectable } from '@angular/core';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {
  constructor(private selectionSvc: SelectionService) {
    this.registerGlobalHotkeys();
  }

  private hotkeys: { [key: string]: () => void } = {
    'm': () => this.selectionSvc.togglePanning(),
  };

  private registerGlobalHotkeys(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (this.hotkeys[key]) {
        event.preventDefault();
        this.hotkeys[key]();
      }
    });
  }
}
