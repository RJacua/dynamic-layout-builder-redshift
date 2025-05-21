import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BorderStylesService } from './border-styles.service';
import { CornerStylesService } from './corner-styles.service';
import { Enablers, Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../general-functions.service';

@Injectable({
  providedIn: 'root'
})
export class EnablerService {

  constructor() { }

  readonly generalSvc = inject(GeneralFunctionsService);
  readonly borderStylesSvc = inject(BorderStylesService);
  readonly cornerStylesSvc = inject(CornerStylesService);

  overridableAttributes = ['border-radius']

  applyEnableStroke(nodeStyle: Styles, enabler: boolean, type: string) {
    return this.borderStylesSvc.changeBorderStylesByEnablers(nodeStyle, enabler, type);
  }

  applyEnableIndividualCorner(nodeStyle: Styles, enabler: boolean, type: string) {
    return this.cornerStylesSvc.changeCornerStylesByEnablers(nodeStyle, enabler, type);
  }

  changeStylesByEnablers(nodeStyle: Styles, enabler: Enablers, type: string) {
    Object.entries(enabler).forEach(([enabler, enablerValue]) => {
      const methodName = `apply${this.generalSvc.capitalize(enabler)}`;
      const fn = (this as any)[methodName];
      if (typeof fn === 'function') {
        // console.log(enabler, ": ", enablerValue, " type: ", type);
        nodeStyle = fn.call(this, nodeStyle, enablerValue, type)();
      } else {
        console.warn(`Handler ${methodName} não encontrado para o enabler:`, enabler);
      }
    });
    this.overridableAttributes.forEach((attr) => {
      if (attr in nodeStyle) {
        delete (nodeStyle as Record<string, string>)[attr];
      }
    })
    return signal(nodeStyle);
  }

}

