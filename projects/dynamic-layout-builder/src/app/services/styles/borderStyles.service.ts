import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StylesService } from './styles.service';
import { Enablers, Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../generalFunctions.service';

@Injectable({
  providedIn: 'root'
})
export class BorderStylesService {

  constructor() { }
  readonly stylesSvc = inject(StylesService);
  readonly generalSvc = inject(GeneralFunctionsService)

  // private enableStrokeSubject = new BehaviorSubject<boolean>(false);
  // enableStroke$ = this.enableStrokeSubject.asObservable();

  // private strokeColorSubject = new BehaviorSubject<string>('#000000');
  // strokeColor$ = this.strokeColorSubject.asObservable();

  // private strokeStyleSubject = new BehaviorSubject<string>('solid');
  // strokeStyle$ = this.strokeStyleSubject.asObservable();

  // private strokeWidthSubject = new BehaviorSubject<number>(1);
  // strokeWidth$ = this.strokeWidthSubject.asObservable();


  setAddStroke(enableStroke: boolean) {
    // this.enableStrokeSubject.next(enableStroke);
    this.stylesSvc.updateSelectedNodeEnabler('enableStroke', enableStroke.toString());
  }
  setStrokeColor(strokeColor: string) {
    // this.strokeColorSubject.next(strokeColor);
    this.stylesSvc.updateSelectedNodeStyle('border-color', strokeColor);
  }
  setStrokeStyle(strokeStyle: string) {
    // this.strokeStyleSubject.next(strokeStyle);
    this.stylesSvc.updateSelectedNodeStyle('border-style', strokeStyle);
  }
  setStrokeWidth(strokeWidth: number) {
    // this.strokeWidthSubject.next(strokeWidth);
    this.stylesSvc.updateSelectedNodeStyle('border-width', strokeWidth.toString() + 'px');
  }

  setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }
  setAllMissingEnablers(defaultEnablers: Enablers, currentEnablers: Enablers) {
    this.stylesSvc.setAllMissingEnablers(defaultEnablers, currentEnablers)
  }
}
