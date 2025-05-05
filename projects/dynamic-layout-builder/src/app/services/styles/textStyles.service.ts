import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StylesService } from './styles.service';

@Injectable({
  providedIn: 'root'
})
export class TextStylesService {

  constructor() { }
  readonly stylesSvc = inject(StylesService);
  // private fontSizeSubject = new BehaviorSubject<number>(24);
  // fontSize$ = this.fontSizeSubject.asObservable();

  // private fontWeightSubject = new BehaviorSubject<number>(400);
  // fontWeight$ = this.fontWeightSubject.asObservable();

  // private fontColorSubject = new BehaviorSubject<string>('#000000');
  // fontColor$ = this.fontColorSubject.asObservable();

  // private horizontalAlignSubject = new BehaviorSubject<string>('center');
  // horizontalAlign$ = this.horizontalAlignSubject.asObservable();

  setFontSize(fontSize: number) {
    // this.fontSizeSubject.next(fontSize);
    this.stylesSvc.updateSelectedNodeStyle('font-size', fontSize.toString() + 'px');
  }
  setFontWeight(fontWeight: number) {
    this.stylesSvc.updateSelectedNodeStyle('font-weight', fontWeight.toString());
  }
  setFontColor(fontColor: string) {
    // this.fontColorSubject.next(fontColor);
    this.stylesSvc.updateSelectedNodeStyle('color', fontColor);
  }
  setHorizontalAlign(horizontalAlign: string) {
    // this.horizontalAlignSubject.next(horizontalAlign);
    this.stylesSvc.updateSelectedNodeStyle('text-align', horizontalAlign);
  }
  setHeaderSize(headerSize: string) {
    // this.fontSizeSubject.next(fontSize);
    this.stylesSvc.updateSelectedNodeHeaderSize(headerSize);
  }

}
