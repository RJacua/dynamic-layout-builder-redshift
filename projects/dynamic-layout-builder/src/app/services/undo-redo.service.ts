import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
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
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  encodedHistory = signal<string[]>([]);
  currentIndex = signal<number>(-1);
  readonly HISTORY_LIMIT = 10;

  private hasInitialized = false;
  private suppressNextPush = false;

  isSuppressedByCreation = signal(false);

  constructor() {
    effect(() => {

      if(this.isSuppressedByCreation()) return;

      this.modelSvc.hasCanvasModelChanged();
      console.log(this.encodedHistory());
      
      untracked(() => {
        const current = this.encodeSvc.encodedStr();
        const history = this.encodedHistory();
        const last = history[history.length - 1];

        if (!this.hasInitialized) {
          if (current) {
            this.hasInitialized = true;
          }
          return;
        }

        if (this.suppressNextPush) {
          this.suppressNextPush = false;
          return;
        }

        if (current && current !== last && !current.includes('=')) {
          this.pushToHistory(current);
        }
      });
    });
  }


  undo() {
    const index = this.currentIndex();
    if (index > 0) {
      const newIndex = index - 1;
      this.currentIndex.set(newIndex);
      const previousEncoded = this.encodedHistory()[newIndex];
      this.suppressNextPush = true;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { encoded: previousEncoded },
        queryParamsHandling: 'merge',
      });
    } else {
      this.currentIndex.set(0);
    }
  }

  redo() {
    const index = this.currentIndex();
    const history = this.encodedHistory();
    if (index < history.length - 1) {
      const newIndex = index + 1;
      this.currentIndex.set(newIndex);
      const nextEncoded = history[newIndex];
      this.suppressNextPush = true;
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

    if (encoded === history[index]) {
      return;
    }

    const newHistory = history.slice(0, index + 1);

    if (newHistory.length >= this.HISTORY_LIMIT) {
      newHistory.shift();
    }

    newHistory.push(encoded);
    this.encodedHistory.set(newHistory);
    this.currentIndex.set(newHistory.length - 1);
  }


}
