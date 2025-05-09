import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BorderStylesService } from './borderStyles.service';
import { StylesService } from './styles.service';
import { GeneralFunctionsService } from '../generalFunctions.service';
import { Enablers, Styles } from '../../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class CornerStylesService {

  readonly stylesSvc = inject(StylesService);
  readonly generalSvc = inject(GeneralFunctionsService);

  readonly defaultCornerStyles: Styles = {
    ['border-radius']: '0px',
  };

  // private strokeRadiusSubject = new BehaviorSubject<number>(50);
  // strokeRadius$ = this.strokeRadiusSubject.asObservable();

  // private enableIndividualCornerSubject = new BehaviorSubject<boolean>(false);
  // enableIndividualCorner$ = this.enableIndividualCornerSubject.asObservable();

  // private topLeftSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  // topLeft$ = this.topLeftSubject.asObservable();

  // private topRightSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  // topRight$ = this.topRightSubject.asObservable();

  // private bottomLeftSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  // bottomLeft$ = this.bottomLeftSubject.asObservable();

  // private bottomRightSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  // bottomRight$ = this.bottomRightSubject.asObservable();


  setIndividualCorner(enableIndividualCorner: boolean) {
    // this.enableIndividualCornerSubject.next(individualCorner);
    this.stylesSvc.updateSelectedNodeEnabler('enableIndividualCorner', enableIndividualCorner.toString());
  }
  setStrokeRadius(strokeRadius: number) {
    // this.strokeRadiusSubject.next(strokeRadius);
    this.stylesSvc.updateSelectedNodeStyle('border-radius', strokeRadius.toString() + 'px');

    // Atualiza os valores individuais com base no geral
    // this.setTopLeft(strokeRadius);
    // this.setTopRight(strokeRadius);
    // this.setBottomLeft(strokeRadius);
    // this.setBottomRight(strokeRadius);
    
    // this.topLeftSubject.next(strokeRadius);
    // this.topRightSubject.next(strokeRadius);
    // this.bottomLeftSubject.next(strokeRadius);
    // this.bottomRightSubject.next(strokeRadius);
  }
  setTopLeft(topLeft: number) {
    // this.topLeftSubject.next(topLeft);
    this.stylesSvc.updateSelectedNodeStyle('border-top-left-radius', topLeft.toString() + 'px');
  }
  setTopRight(topRight: number) {
    // this.topRightSubject.next(topRight);
    this.stylesSvc.updateSelectedNodeStyle('border-top-right-radius', topRight.toString() + 'px');
  }
  setBottomLeft(bottomLeft: number) {
    // this.bottomLeftSubject.next(bottomLeft);
    this.stylesSvc.updateSelectedNodeStyle('border-bottom-left-radius', bottomLeft.toString() + 'px');
  }
  setBottomRight(bottomRight: number) {
    // this.bottomRightSubject.next(bottomRight);
    this.stylesSvc.updateSelectedNodeStyle('border-bottom-right-radius', bottomRight.toString() + 'px');
  }

  setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }
  setAllMissingEnablers(defaultEnablers: Enablers, currentEnablers: Enablers) {
    this.stylesSvc.setAllMissingEnablers(defaultEnablers, currentEnablers)
  }

}
