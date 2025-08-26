import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StylesService } from './styles.service';
import { Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../general-functions.service';

@Injectable({
  providedIn: 'root'
})
export class TextStylesService {

  constructor() { }
  readonly stylesSvc = inject(StylesService);

  readonly hOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];
  readonly hOptionDefault = this.hOptions[1].value;

  readonly headerOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  readonly headerOptionDefault = this.headerOptions[0];

  readonly colorOpacityDefault = "1";
  readonly defaultHeaderStyles: Styles = {
    color: `rgba(0, 0, 0, ${this.colorOpacityDefault})`,
    ['text-align']: this.hOptionDefault,
  };
  readonly defaultParagraphStyles: Styles = {
    ['font-size']: '16px',
    ['font-weight']: '400',
    color: `rgba(0, 0, 0, ${this.colorOpacityDefault})`,
    ['text-align']: this.hOptionDefault,
  };

  setFontSize(fontSize: number) {
    // this.fontSizeSubject.next(fontSize);
    this.stylesSvc.updateSelectedNodeStyle('font-size', fontSize.toString() + 'px');
  }
  setFontWeight(fontWeight: number) {
    this.stylesSvc.updateSelectedNodeStyle('font-weight', fontWeight.toString());
  }
  setFontColor(fontColor: string) {
    // this.fontColorSubject.next(fontColor);
    this.stylesSvc.updateSelectedNodeStyle('color', fontColor);
  }
  setHorizontalAlign(horizontalAlign: string) {
    // this.horizontalAlignSubject.next(horizontalAlign);
    this.stylesSvc.updateSelectedNodeStyle('text-align', horizontalAlign);
  }
  setHeaderSize(headerSize: string) {
    // this.fontSizeSubject.next(fontSize);
    this.stylesSvc.updateSelectedNodeSpecificAttribute('headerSize', headerSize);
  }

  setAllMissing(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles);
  }

}
