import { inject, Injectable, signal } from '@angular/core';
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
  readonly generalSvc = inject(GeneralFunctionsService);

  readonly defaultContainerStyles: Styles = {
    ['border-color']: '#81828555',
    ['border-style']: 'solid',
    ['border-width']: '1px',
  };
  readonly defaultComponentStyles: Styles = {
    ['border-color']: '',
    ['border-style']: 'solid',
    ['border-width']: '0px',
  };

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
    this.stylesSvc.updateSelectedNodeEnabler('enableStroke', enableStroke);
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

  changeBorderStylesByEnablers(nodeStyle: Styles, borderEnabler: boolean, type: string){
    
    // console.log("BorderSvc changeToDefaultStyles: ", type);
    // console.log("aqui: ", nodeStyle, borderEnabler)
    if(nodeStyle && !borderEnabler){
      // console.log("ENTROU ", nodeStyle)
      if(type === 'container'){
        // console.log(":) ", this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultContainerStyles));
        return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultContainerStyles));
      }
      else return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultComponentStyles));
    }
    
    else return signal(nodeStyle);
  }
}