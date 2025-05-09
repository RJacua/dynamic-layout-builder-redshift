import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StylesService } from './styles.service';
import { Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../generalFunctions.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundStylesService {

  readonly stylesSvc = inject(StylesService);
  readonly generalSvc = inject(GeneralFunctionsService)

  // private bgColorSubject = new BehaviorSubject<string>('#ffffff');
  // bgColor$ = this.bgColorSubject.asObservable();

  // private bgOpacitySubject = new BehaviorSubject<number>(1);
  // bgOpacity$ = this.bgOpacitySubject.asObservable();


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