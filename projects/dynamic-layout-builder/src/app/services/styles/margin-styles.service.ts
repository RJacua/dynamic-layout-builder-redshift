import { inject, Injectable, signal } from '@angular/core';
import { Enablers, Styles } from '../../interfaces/layout-elements';
import { StylesService } from './styles.service';

@Injectable({
  providedIn: 'root'
})
export class MarginStyleService {

  readonly stylesSvc = inject(StylesService);

  readonly defaultEnabler: Enablers = {
    enableIndividualMargin: false,
  }

   readonly unitOptions = ['px', '%'];
    defaultUnit = this.unitOptions[0];
    readonly defaultMarginStyles: Styles = {
      margin: '0' + this.defaultUnit,
    };
    readonly defaultIndividualMarginStyles: Styles = {
      ['margin-top']: '0px',
      ['margin-right']: '0px',
      ['margin-bottom']: '0px',
      ['margin-left']: '0px',
    };
  
    
    setIndividualMargin(enableIndividualMargin: boolean, individualMarginOptions: any, generalMargin: number | null, unit: string | null) {
      this.stylesSvc.updateSelectedNodeEnabler('enableIndividualMargin', enableIndividualMargin);
  
      // console.log("AQUI", generalmargin)
      if (!enableIndividualMargin) return
      if (individualMarginOptions.top.value === individualMarginOptions.right.value && individualMarginOptions.right.value === individualMarginOptions.bottom.value && individualMarginOptions.bottom.value === individualMarginOptions.left.value && individualMarginOptions.top.value === 0 ) {
        console.log("tudo zero", individualMarginOptions.top.value);
  
        this.stylesSvc.updateSelectedNodeStyle('margin-top', (generalMargin ?? 0) + (unit ?? this.defaultUnit));
        individualMarginOptions.top.value = (generalMargin ?? 0);
  
        this.stylesSvc.updateSelectedNodeStyle('margin-right', (generalMargin ?? 0) + (unit ?? this.defaultUnit));
        individualMarginOptions.right.value = (generalMargin ?? 0);
  
        this.stylesSvc.updateSelectedNodeStyle('margin-bottom', (generalMargin ?? 0) + (unit ?? this.defaultUnit));
        individualMarginOptions.bottom.value = (generalMargin ?? 0);
  
        this.stylesSvc.updateSelectedNodeStyle('margin-left', (generalMargin ?? 0) + (unit ?? this.defaultUnit));
        individualMarginOptions.left.value = (generalMargin ?? 0);
      }
  
    }
  
    setMargin(margin: number | undefined, unit: string) {
      const value = `${margin}${unit}`;
      this.stylesSvc.updateSelectedNodeStyle('margin', value);
    }
  
    setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
      this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
    }
    setAllMissingEnablers(defaultEnablers: Enablers, currentEnablers: Enablers) {
      this.stylesSvc.setAllMissingEnablers(defaultEnablers, currentEnablers)
    }
  
    setIndividualMargins(margins: Partial<{ top: number | null; right: number | null; bottom: number | null; left: number | null }>, unit: string) {
      this.stylesSvc.updateSelectedNodeStyle('margin-top', `${margins.top}${unit}`);
      this.stylesSvc.updateSelectedNodeStyle('margin-right', `${margins.right}${unit}`);
      this.stylesSvc.updateSelectedNodeStyle('margin-bottom', `${margins.bottom}${unit}`);
      this.stylesSvc.updateSelectedNodeStyle('margin-left', `${margins.left}${unit}`);
    }
  
    changeMarginStylesByEnablers(nodeStyle: Styles, individualMarginEnabler: boolean, type: string) {
  
      let defaultIndividualMarginStylesInside: Styles = {
        margin: '0px',
        ['margin-top']: nodeStyle['margin'],
        ['margin-right']: nodeStyle['margin'],
        ['margin-bottom']: nodeStyle['margin'],
        ['margin-left']: nodeStyle['margin'],
      };
  
      if (nodeStyle && !individualMarginEnabler) {
        return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, defaultIndividualMarginStylesInside));
      }
  
      return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultMarginStyles));
    }
  
}
