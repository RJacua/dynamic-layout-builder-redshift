import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextStylesService {

  constructor() { }
  private fontSizeSubject = new BehaviorSubject<number>(24);
  private fontWeightSubject = new BehaviorSubject<number>(400);
  private fontColorSubject = new BehaviorSubject<string>('#000000');
  private horizontalAlignSubject = new BehaviorSubject<string>('center');

  fontSize$ = this.fontSizeSubject.asObservable();
  fontWeight$ = this.fontWeightSubject.asObservable();
  fontColor$ = this.fontColorSubject.asObservable();
  horizontalAlign$ = this.horizontalAlignSubject.asObservable();

  setfontSize(fontSize: number) {
    this.fontSizeSubject.next(fontSize);
  }
  setfontWeight(fontWeight: number) {
    this.fontWeightSubject.next(fontWeight);
  }
  setfontColor(fontColor: string) {
    this.fontColorSubject.next(fontColor);
  }
  setHorizontalAlign(horizontalAlign: string) {
    this.horizontalAlignSubject.next(horizontalAlign);
  }
}
