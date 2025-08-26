import { inject, Injectable } from '@angular/core';
import { StylesService } from './styles.service';
import { Styles } from '../../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class IframeStylesService {

  stylesSvc = inject(StylesService)

  constructor() { }

  setUrl(url: string) {
    this.stylesSvc.updateSelectedNodeSpecificAttribute('src', url);
  }

  setAlt(alt: string) {
    this.stylesSvc.updateSelectedNodeSpecificAttribute('alt', alt);
  }

  setTooltip(tooltip: string) {
    this.stylesSvc.updateSelectedNodeSpecificAttribute('tooltip', tooltip);
  }

}
