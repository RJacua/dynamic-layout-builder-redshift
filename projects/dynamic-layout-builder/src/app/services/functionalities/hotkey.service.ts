import { inject, Injectable } from '@angular/core';
import { PanningService } from '../panning.service';
import { UndoRedoService } from '../functionalities/undo-redo.service';
import { SelectionService } from '../selection.service';
import { CopyPasteService } from './copy-paste.service';
import { BannerService } from '../banner.service';
import { ModelService } from '../model.service';
import { ExportImportService } from './export-import.service';
import { EncodeService } from '../encode.service';

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {
  readonly modelSvc = inject(ModelService);
  readonly panningSvc = inject(PanningService);
  readonly selectionSvc = inject(SelectionService);

  readonly undoRedoSvc = inject(UndoRedoService);

  readonly copyPasteSvc = inject(CopyPasteService);
  readonly bannerSvc = inject(BannerService);
  readonly exportImportSvc = inject(ExportImportService);
  readonly encodeSvc = inject(EncodeService);
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
      const isTyping = target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || (target as HTMLElement).isContentEditable;

      // 🔹 ESC sempre funciona, mesmo editando texto
      if (key === 'escape') {
        event.preventDefault();
        this.selectionSvc.unselect();
        const active = document.activeElement as HTMLElement;
        if (active && active.isContentEditable) {
          active.blur(); // remove foco do editor
        }

        return;
      }

      // 🔹 bloqueia os outros atalhos quando está digitando
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

      if (event.ctrlKey && key === 'c') {
        event.preventDefault();
        this.copyPasteSvc.copySelection();
        return;
      }

      if (event.ctrlKey && key === 'x') {
        event.preventDefault();
        this.copyPasteSvc.cutSelection();
        return;
      }

      if (event.ctrlKey && key === 'v') {
        event.preventDefault();
        this.copyPasteSvc.pasteToSelection();
        return;
      }

      if (event.ctrlKey && key === 's') {
        event.preventDefault();

        // Usa encodeSvc para pegar a versão atual do modelo em string
        const modelString = this.encodeSvc.decoder(this.encodeSvc.encodedStr);
        this.exportImportSvc.downloadModel(modelString);
        return;
      }

      if (key === 'delete') {
        event.preventDefault();
        const id = this.selectionSvc.selectedElementId();
        if (id && id !== 'canvas') {
          this.bannerSvc.show({
            message: 'Are you sure you want to delete this element?',
            variant: 'warning',
            actions: [
              { id: 'yes', label: 'Yes', kind: 'danger' },
              { id: 'no', label: 'No', kind: 'default' },
            ]
          }).then(result => {
            if (result === 'yes') {
              this.modelSvc.removeNodeById(id);
              this.selectionSvc.unselect();
            }
          });
        }
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

    window.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 1) {
        // event.preventDefault();
        // this.panningSvc.setPanning(true);
      }
    }, { capture: true });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 1) {
        // event.preventDefault();
        // this.panningSvc.setPanning(false);
      }
    }, { capture: true });
  }
}
