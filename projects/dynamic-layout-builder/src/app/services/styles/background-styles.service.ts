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
  
  readonly BgRepeats = [
    { value: 'repeat', label: 'Repeat' },
    { value: 'no-repeat', label: 'No Repeat' },
  ];
  readonly BgRepeatDefault = this.BgRepeats[1].value;

  readonly BgSizes = [
    { value: 'auto', label: 'Auto' },
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
  ];
  readonly BgSizeDefault = this.BgSizes[1].value;
  readonly containerStyles: Styles = {
    ["background-color"]: 'rgba(255, 255, 255,0)',
    opacity: "1",
    ['flex-direction']: this.flexDirectionDefault,
    ["background-image"]: '',
    ["background-repeat"]: 'no-repeat',
    ["background-size"]: 'auto',
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
  setUrlImage(urlImage: string) {
    var backgroundImage = `url('${urlImage}')`;
    this.stylesSvc.updateSelectedNodeStyle('background-image', backgroundImage);
  }

  setBgRepeat(BgRepeat: string) {
    this.stylesSvc.updateSelectedNodeStyle('background-repeat', BgRepeat);
  }

  setBgSize(BgSize: string) {
    this.stylesSvc.updateSelectedNodeStyle('background-size', BgSize);
  }
  setAllMissing(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }



}