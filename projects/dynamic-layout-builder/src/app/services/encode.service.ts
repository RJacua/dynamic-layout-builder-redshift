import { computed, inject, Injectable, Signal } from '@angular/core';
import { ModelService } from './model.service';

@Injectable({
  providedIn: 'root'
})
export class EncodeService {

  readonly modelSvc = inject(ModelService);

  canvas = computed(() => this.modelSvc.canvas());
  canvasString: Signal<string> = computed(
    () => JSON.stringify(this.canvas(), null)
  )

  // Encode String
  utf8Str: Signal<string> = computed(() => encodeURIComponent(this.canvasString()));
  encodedStr: Signal<string> = computed(() => btoa(this.utf8Str()));

  // Decode String
  atob: Signal<string> = computed(() => atob(this.encodedStr()));
  decodedStr: Signal<string> = computed(() => decodeURIComponent(this.atob()));

  constructor() { }

  decoder(encoded: Signal<string>) {
    return decodeURIComponent(atob(encoded()));
  }

}
