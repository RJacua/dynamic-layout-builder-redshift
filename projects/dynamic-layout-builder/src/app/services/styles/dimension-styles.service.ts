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
    height: '100' + this.defaultUnit,
    width: '100' + this.defaultUnit,
  };

  readonly defaultMaxDimensionsStyles: Styles = {
    ['max-height']: '100' + this.defaultUnit,
    ['max-width']: '100' + this.defaultUnit,
  }

  readonly defaultMinDimensionsStyles: Styles = {
    ['min-height']: '0' + this.defaultUnit,
    ['min-width']: '0' + this.defaultUnit,
  }

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

  setMaxHeight(maxHeight: number | undefined, unit: string) {
    const value = `${maxHeight}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('max-height', value);
  }

  setMaxWidth(maxWidth: number | undefined, unit: string) {
    const value = `${maxWidth}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('max-width', value);
  }

  setMinHeight(minHeight: number | undefined, unit: string) {
    const value = `${minHeight}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('min-height', value);
  }

  setMinWidth(minWidth: number | undefined, unit: string) {
    const value = `${minWidth}${unit}`;
    this.stylesSvc.updateSelectedNodeStyle('min-width', value);
  }
}
