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
}
