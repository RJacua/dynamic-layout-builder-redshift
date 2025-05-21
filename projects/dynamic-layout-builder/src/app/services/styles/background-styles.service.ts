import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StylesService } from './styles.service';
import { Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../general-functions.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundStylesService {

  readonly stylesSvc = inject(StylesService);

  readonly flexDirections = [
    { value: 'row', label: 'Row' },
    { value: 'row-reverse', label: 'Row Reverse' },
    { value: 'column', label: 'Column' },
    { value: 'column-reverse', label: 'Column Reverse' }
  ];
  readonly flexDirectionDefault = this.flexDirections[2].value;

  readonly containerStyles: Styles = {
    ["background-color"]: 'rgba(255, 255, 255,0)',
    opacity: "1",
    ['flex-direction']: this.flexDirectionDefault,
  };

  readonly allStyles: Styles = {
    ["background-color"]: 'rgba(255,255,255,0)',
    opacity: "1",
  };

  setBgColor(bgColor: string) {
    // this.bgColorSubject.next(bgColor);
    this.stylesSvc.updateSelectedNodeStyle('background-color', bgColor);
  }
  setBgOpacity(bgOpacity: number) {
    // this.bgOpacitySubject.next(bgOpacity / 100);
    this.stylesSvc.updateSelectedNodeStyle('opacity', (bgOpacity / 100).toString());
  }

  setFlexDirection(direction: string) {
    // this.bgOpacitySubject.next(bgOpacity / 100);
    this.stylesSvc.updateSelectedNodeStyle('flex-direction', direction);
  }

  // setAll(defaultStyles: Styles) {
  //   // console.log("Default Style:", defaultStyles);

  //   Object.entries(defaultStyles).forEach((attr) => {
  //     // console.log("update", attr[0], " ->", attr[1]);
  //     this.stylesSvc.updateSelectedNodeStyle(attr[0], attr[1]);
  //   })

  // }

  setAllMissing(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }



}