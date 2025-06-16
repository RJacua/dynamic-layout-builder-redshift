import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SelectionService } from './selection.service';
import { ModelService } from './model.service';
import { ContainerData, LayoutElement } from '../interfaces/layout-elements';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeService } from './encode.service';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {


  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly encodeSvc = inject(EncodeService);
  encodedHistory = signal<string[]>([]);
  currentIndex = signal<number>(-1); // começa sem histórico
  readonly HISTORY_LIMIT = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      const current = this.encodeSvc.encodedStr();

      const history = this.encodedHistory();
      const last = history[history.length - 1];

      if (current && current !== last) {
        this.pushToHistory(current);
      }
    });
  }

  undo() {
    const index = this.currentIndex();
    if (index > 0) {
      const newIndex = index - 1;
      this.currentIndex.set(newIndex);
      const previousEncoded = this.encodedHistory()[newIndex];
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { encoded: previousEncoded },
        queryParamsHandling: 'merge',
      });
    }
  }

  redo() {
    const index = this.currentIndex();
    const history = this.encodedHistory();
    if (index < history.length - 1) {
      const newIndex = index + 1;
      this.currentIndex.set(newIndex);
      const nextEncoded = history[newIndex];
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { encoded: nextEncoded },
        queryParamsHandling: 'merge',
      });
    }
  }

  pushToHistory(encoded: string) {
    const history = this.encodedHistory();
    const index = this.currentIndex();

    // Remove qualquer item "à frente" se o usuário alterou o estado após um undo
    const newHistory = history.slice(0, index + 1);

    if (newHistory.length >= this.HISTORY_LIMIT) {
      newHistory.shift(); // remove o mais antigo
    }

    newHistory.push(encoded);
    this.encodedHistory.set(newHistory);
    this.currentIndex.set(newHistory.length - 1);
  }


}
