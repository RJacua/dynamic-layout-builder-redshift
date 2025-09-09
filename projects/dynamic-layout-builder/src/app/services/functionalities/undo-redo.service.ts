import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { SelectionService } from '../selection.service';
import { ModelService } from '../model.service';
import { ContainerData, LayoutElement } from '../../interfaces/layout-elements';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeService } from '../encode.service';
import { PanningService } from '../panning.service';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {


  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly encodeSvc = inject(EncodeService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly panningSvc = inject(PanningService);
  encodedHistory = signal<string[]>([]);
  currentIndex = signal<number>(-1);
  readonly HISTORY_LIMIT = 10;

  private hasInitialized = false;
  private suppressNextPush = false;

  isSuppressedByCreation = signal(false);

  // constructor() {
  //   effect(() => {

  //     if (this.isSuppressedByCreation()) return;

  //     this.modelSvc.hasCanvasModelChanged();

  //     untracked(() => {
  //       const current = this.encodeSvc.encodedStr();
  //       const history = this.encodedHistory();
  //       const last = history[history.length - 1];

  //       if (!this.hasInitialized) {
  //         if (current) {
  //           this.hasInitialized = true;
  //         }
  //         return;
  //       }

  //       if (this.suppressNextPush) {
  //         this.suppressNextPush = false;
  //         return;
  //       }

  //       this.pushToHistory(current);

  //     });
  //   });
  // }

  constructor() {
    effect(() => {
      const current = this.encodeSvc.encodedStr(); // já depende do fragment
      const history = this.encodedHistory();
      const last = history[history.length - 1];

      if (!this.hasInitialized) {
        if (current) {
          this.hasInitialized = true;
          this.pushToHistory(current);
        }
        return;
      }

      if (this.suppressNextPush) {
        this.suppressNextPush = false;
        return;
      }

      if (current && current !== last) {
        this.pushToHistory(current);
      }
    });
  }


  undo() {
    this.selectionSvc.unselect();

    const index = this.currentIndex();
    if (index > 0) {
      const newIndex = index - 1;
      this.currentIndex.set(newIndex);
      const previousEncoded = this.encodedHistory()[newIndex];
      this.suppressNextPush = true;

      const decoded = JSON.parse(this.encodeSvc.decoder(signal(previousEncoded)));
      this.modelSvc.setCanvasModel(decoded);

      this.router.navigate([], {
        relativeTo: this.route,
        fragment: previousEncoded,
        replaceUrl: true
      });
    } else {
      this.currentIndex.set(0);
    }
    setTimeout(() => {
      this.selectionSvc.selectCanvas();
    }, 0);
  }

  redo() {
    this.selectionSvc.unselect();

    const index = this.currentIndex();
    const history = this.encodedHistory();
    if (index < history.length - 1) {
      const newIndex = index + 1;
      this.currentIndex.set(newIndex);
      const nextEncoded = history[newIndex];
      this.suppressNextPush = true;

      // aplica no modelo
      const decoded = JSON.parse(this.encodeSvc.decoder(signal(nextEncoded)));
      this.modelSvc.setCanvasModel(decoded);

      // atualiza a URL no fragmento
      this.router.navigate([], {
        relativeTo: this.route,
        fragment: nextEncoded,
        replaceUrl: true
      });
    }
        setTimeout(() => {
      this.selectionSvc.selectCanvas();
    }, 0);
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
