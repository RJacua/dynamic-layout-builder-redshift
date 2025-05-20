import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BorderStylesService } from './borderStyles.service';
import { CornerStylesService } from './cornerStyles.service';
import { Enablers, Styles } from '../../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class EnablerService {

  constructor() { }

  readonly borderStylesSvc = inject(BorderStylesService);
  readonly cornerStylesSvc = inject(CornerStylesService);

  applyEnableStroke(nodeStyle: Styles, enabler: boolean, type: string) {
    return this.borderStylesSvc.changeBorderStylesByEnablers(nodeStyle, enabler, type);
  }

  applyEnableIndividualCorner(nodeStyle: Styles, enabler: boolean, type: string) {
    return this.cornerStylesSvc.changeCornerStylesByEnablers(nodeStyle, enabler, type);
  }

  changeStylesByEnablers(nodeStyle: Styles, enabler: Enablers, type: string) {
    Object.entries(enabler).forEach(([enabler, enablerValue]) => {
        const methodName = `apply${this.capitalize(enabler)}`;
        const fn = (this as any)[methodName];
        if (typeof fn === 'function') {
          console.log("value: ", enablerValue)
          nodeStyle = fn.call(this, nodeStyle, enablerValue, type)();
        } else {
          console.warn(`Handler ${methodName} não encontrado para o enabler:`, enabler);
        }
    });
    return signal(nodeStyle);
  }

  private capitalize(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
}

