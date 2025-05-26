import { inject, Injectable } from '@angular/core';
import { StylesService } from './styles.service';
import { Styles } from '../../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class DimensionStylesService {

  readonly stylesSvc = inject(StylesService);

  readonly unitOptions = ['px', '%', 'cm'];
  defaultUnit = this.unitOptions[1];

  readonly defaultAutoDimensionsCheckBox = {
    heightAuto: true,
    widthAuto: true,
  }
  readonly defaultAutoDimensionsStyles: Styles = {
    height: 'auto',
    width: 'auto',
  };
  readonly defaultDimensionsStyles: Styles = {
    height: '100'+ this.defaultUnit,
    width: '100' + this.defaultUnit,
  };

  setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }

  setHeightAuto() {
    this.stylesSvc.updateSelectedNodeStyle('height', 'auto');
  }
  setWidthAuto() {
    this.stylesSvc.updateSelectedNodeStyle('width', 'auto');
  }

  setHeight(height: number | undefined, unit: string) {
    const value = `${height}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('height', value);
  }
  
  setWidth(width: number | undefined, unit: string) {
    const value = `${width}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('width', value);
  }
}
