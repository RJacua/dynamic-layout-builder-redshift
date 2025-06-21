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

  readonly colorOpacityDefault = "1";
  
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

  readonly objFits = [
    { value: 'none', label: 'None' },
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
    { value: 'fill', label: 'Fill' },
    { value: 'scale-down', label: 'Scale-Down' },
  ];
  readonly objFitDefault = this.objFits[0].value;
  readonly containerStyles: Styles = {
    ["background-color"]: `rgba(255, 255, 255, ${this.colorOpacityDefault})`,
    opacity: "1",
    ['flex-direction']: this.flexDirectionDefault,
    ["background-image"]: '',
    ["background-repeat"]: this.BgRepeatDefault,
    ["background-size"]: this.BgSizeDefault,
  };

  readonly allStyles: Styles = {
    ["background-color"]: `rgba(255, 255, 255, ${this.colorOpacityDefault})`,
    opacity: "1",
  };

  readonly imageStyles: Styles = {
    ['object-fit']: this.objFitDefault,
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

  setObjFit(objFit: string) {
    this.stylesSvc.updateSelectedNodeStyle('object-fit', objFit);
  }

  setAllMissing(defaultStyles: Styles, currentStyles: Styles) {
    this.stylesSvc.setAllMissingStyles(defaultStyles, currentStyles)
  }



}