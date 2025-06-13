import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BorderStylesService } from './border-styles.service';
import { StylesService } from './styles.service';
import { GeneralFunctionsService } from '../general-functions.service';
import { ContainerData, Enablers, LayoutData, LayoutElement, Styles } from '../../interfaces/layout-elements';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CornerStylesService {

  readonly stylesSvc = inject(StylesService);



  readonly defaultEnabler: Enablers = {
    enableIndividualCorner: false,
  }

  readonly defaultCornerStyles: Styles = {
    ['border-radius']: '0px',
  };

  readonly defaultIndividualCornerStyles: Styles = {
    ['border-top-left-radius']: '0px',
    ['border-top-right-radius']: '0px',
    ['border-bottom-left-radius']: '0px',
    ['border-bottom-right-radius']: '0px',
  };


  setIndividualCorner(enableIndividualCorner: boolean, cornerOptions: any, generalRadius: number | null) {
    // this.enableIndividualCornerSubject.next(individualCorner);
    this.stylesSvc.updateSelectedNodeEnabler('enableIndividualCorner', enableIndividualCorner);

    console.log("AQUI", generalRadius)
    if (!enableIndividualCorner) return
    if (cornerOptions.topLeft.value === cornerOptions.topRight.value && cornerOptions.topRight.value === cornerOptions.bottomLeft.value && cornerOptions.bottomLeft.value === cornerOptions.bottomRight.value && cornerOptions.topLeft.value === 0) {
      console.log("tudo zero", cornerOptions.topLeft.value);

      this.stylesSvc.updateSelectedNodeStyle('border-top-left-radius', (generalRadius ?? 0) + 'px');
      cornerOptions.topLeft.value = (generalRadius ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('border-top-right-radius', (generalRadius ?? 0) + 'px');
      cornerOptions.topRight.value = (generalRadius ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('border-bottom-left-radius', (generalRadius ?? 0) + 'px');
      cornerOptions.bottomLeft.value = (generalRadius ?? 0);

      this.stylesSvc.updateSelectedNodeStyle('border-bottom-right-radius', (generalRadius ?? 0) + 'px');
      cornerOptions.bottomRight.value = (generalRadius ?? 0);
    }

  }
  setStrokeRadius(strokeRadius: number) {
    // this.strokeRadiusSubject.next(strokeRadius);
    this.stylesSvc.updateSelectedNodeStyle('border-radius', strokeRadius.toString() + 'px');
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

  changeCornerStylesByEnablers(nodeStyle: Styles, individualCornerEnabler: boolean, type: string) {

    let defaultIndividualCornerStylesInside: Styles = {
      ['border-radius']: '0px',
      ['border-top-left-radius']: nodeStyle['border-radius'],
      ['border-top-right-radius']: nodeStyle['border-radius'],
      ['border-bottom-left-radius']: nodeStyle['border-radius'],
      ['border-bottom-right-radius']: nodeStyle['border-radius'],
    };

    if (nodeStyle && !individualCornerEnabler) {
      return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, defaultIndividualCornerStylesInside));
    }

    return signal(this.stylesSvc.changeToDefaultStyles(nodeStyle, this.defaultCornerStyles));
  }


}
