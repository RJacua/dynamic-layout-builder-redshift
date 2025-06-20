import { inject, Injectable } from '@angular/core';
import { PanningService } from './panning.service';
import { UndoRedoService } from './undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {
  private panningSvc = inject(PanningService);
  private undoRedoSvc = inject(UndoRedoService);

  private keysPressed = new Set<string>();

  constructor() {
    this.registerGlobalHotkeys();
  }

  private simpleHotkeys: { [key: string]: () => void } = {
    'm': () => this.panningSvc.togglePanning(),
  };

  private registerGlobalHotkeys(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable;
      if (isTyping) return;

      if (this.keysPressed.has(key)) return;
      this.keysPressed.add(key);

      if (key === ' ') {
        event.preventDefault();
        this.panningSvc.setPanning(true);
        return;
      }

      if (event.ctrlKey && !event.shiftKey && key === 'z') {
        event.preventDefault();
        this.undoRedoSvc.undo();
        return;
      }

      if (event.ctrlKey && key === 'y') {
        event.preventDefault();
        this.undoRedoSvc.redo();
        return;
      }

      const hotkeyFn = this.simpleHotkeys[key];
      if (hotkeyFn) {
        event.preventDefault();
        hotkeyFn();
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      this.keysPressed.delete(key);

      if (key === ' ') {
        this.panningSvc.setPanning(false);
      }
    });
  }
}
