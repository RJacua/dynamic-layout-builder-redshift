import { inject, Injectable, signal } from '@angular/core';
import { Enablers, Styles } from '../../interfaces/layout-elements';
import { StylesService } from './styles.service';

@Injectable({
  providedIn: 'root'
})
export class PaddingStyleService {

  readonly stylesSvc = inject(StylesService);

  readonly defaultEnabler: Enablers = {
    enableIndividualPadding: false,
  }

  readonly unitOptions = ['px', '%'];
  defaultUnit = this.unitOptions[0];
  readonly defaultPaddingStyles: Styles = {
    padding: '0' + this.defaultUnit,
  };
  readonly defaultIndividualPaddingStyles: Styles = {
    ['padding-top']: '0px',
    ['padding-right']: '0px',
    ['padding-bottom']: '0px',
    ['padding-left']: '0px',
  };


  setIndividualPadding(enableIndividualPadding: boolean, individualPaddingOptions: any, generalPadding: number | null, unit: string | null) {
    this.stylesSvc.updateSelectedNodeEnabler('enableIndividualPadding', enableIndividualPadding);

    // console.log("AQUI", generalPadding)
    if (!enableIndividualPadding) return
    if (individualPaddingOptions.top.value === individualPaddingOptions.right.value && individualPaddingOptions.right.value === individualPaddingOptions.bottom.value && individualPaddingOptions.bottom.value === individualPaddingOptions.left.value && individualPaddingOptions.top.value === 0 ) {
      console.log("tudo zero", individualPaddingOptions.top.value);

      this.stylesSvc.updateSelectedNodeStyle('padding-top', (generalPadding ?? 0) + (unit ?? this.defaultUnit));
      individualPaddingOptions.top.value = (generalPadding ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('padding-right', (generalPadding ?? 0) + (unit ?? this.defaultUnit));
      individualPaddingOptions.right.value = (generalPadding ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('padding-bottom', (generalPadding ?? 0) + (unit ?? this.defaultUnit));
      individualPaddingOptions.bottom.value = (generalPadding ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('padding-left', (generalPadding ?? 0) + (unit ?? this.defaultUnit));
      individualPaddingOptions.left.value = (generalPadding ?? 0);
    }

  }

  setPadding(padding: number | undefined, unit: string) {
    const value = `${padding}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('padding', value);
  }

  setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }
  setAllMissingEnablers(defaultEnablers: Enablers, currentEnablers: Enablers) {
    this.stylesSvc.setAllMissingEnablers(defaultEnablers, currentEnablers)
  }

  setIndividualPaddings(paddings: Partial<{ top: number | null; right: number | null; bottom: number | null; left: number | null }>, unit: string) {
    this.stylesSvc.updateSelectedNodeStyle('padding-top', `${paddings.top}${unit}`);
    this.stylesSvc.updateSelectedNodeStyle('padding-right', `${paddings.right}${unit}`);
    this.stylesSvc.updateSelectedNodeStyle('padding-bottom', `${paddings.bottom}${unit}`);
    this.stylesSvc.updateSelectedNodeStyle('padding-left', `${paddings.left}${unit}`);
  }

  changePaddingStylesByEnablers(nodeStyle: Styles, individualPaddingEnabler: boolean, type: string) {

    let defaultIndividualPaddingStylesInside: Styles = {
      padding: '0px',
      ['padding-top']: nodeStyle['padding'],
      ['padding-right']: nodeStyle['padding'],
      ['padding-bottom']: nodeStyle['padding'],
      ['padding-left']: nodeStyle['padding'],
    };

    if (nodeStyle && !individualPaddingEnabler) {
      return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, defaultIndividualPaddingStylesInside));
    }

    return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultPaddingStyles));
  }

}
