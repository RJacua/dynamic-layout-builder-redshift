import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  constructor() { }

  private bgColorSubject = new BehaviorSubject<string>('#ffffff');
  private bgOpacitySubject = new BehaviorSubject<number>(1);
  bgColor$ = this.bgColorSubject.asObservable();
  bgOpacity$ = this.bgOpacitySubject.asObservable();

  // Text Styles
  private fontSizeSubject = new BehaviorSubject<number>(24);
  private fontWeightSubject = new BehaviorSubject<number>(400);
  private fontColorSubject = new BehaviorSubject<string>('#000000');
  private horizontalAlignSubject = new BehaviorSubject<string>('center');
  fontSize$ = this.fontSizeSubject.asObservable();
  fontWeight$ = this.fontWeightSubject.asObservable();
  fontColor$ = this.fontColorSubject.asObservable();
  horizontalAlign$ = this.horizontalAlignSubject.asObservable();


  // Stroke Styles
  private addStrokeSubject = new BehaviorSubject<boolean>(false);
  private strokeColorSubject = new BehaviorSubject<string>('#000000');
  private strokeRadiusSubject = new BehaviorSubject<number>(0);
  private strokeStyleSubject = new BehaviorSubject<string>('solid');
  private strokeWidthSubject = new BehaviorSubject<number>(1);
  addStroke$ = this.addStrokeSubject.asObservable();
  strokeColor$ = this.strokeColorSubject.asObservable();
  strokeRadius$ = this.strokeRadiusSubject.asObservable();
  strokeStyle$ = this.strokeStyleSubject.asObservable();
  strokeWidth$ = this.strokeWidthSubject.asObservable();


  private individualCornerSubject = new BehaviorSubject<boolean>(false);
  individualCorner$ = this.individualCornerSubject.asObservable();
  // Stroke Corner
  private topLeftSubject = new BehaviorSubject<number>(0);
  private topRightSubject = new BehaviorSubject<number>(0);
  private bottomLeftSubject = new BehaviorSubject<number>(0);
  private bottomRightSubject = new BehaviorSubject<number>(0);

  topLeft$ = this.topLeftSubject.asObservable();
  topRight$ = this.topRightSubject.asObservable();
  bottomLeft$ = this.bottomLeftSubject.asObservable();
  bottomRight$ = this.bottomRightSubject.asObservable();


  setBgColor(bgColor: string) {
    this.bgColorSubject.next(bgColor);
  }

  setBgOpacity(bgOpacity: number) {
    this.bgOpacitySubject.next(bgOpacity / 100);
  }
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

  setAddStroke(addStroke: boolean) {
    this.addStrokeSubject.next(addStroke);
  }
  setIndividualCorner(individualCorner: boolean) {
    this.individualCornerSubject.next(individualCorner);
  }
  setStrokeColor(strokeColor: string) {
    this.strokeColorSubject.next(strokeColor);
  }
  setStrokeRadius(strokeRadius: number) {
    this.strokeRadiusSubject.next(strokeRadius);
  }
  setStrokeStyle(strokeStyle: string) {
    this.strokeStyleSubject.next(strokeStyle);
  }
  setStrokeWidth(strokeWidth: number) {
    this.strokeWidthSubject.next(strokeWidth);
  }
  setTopLeft(topLeft: number) {
    this.topLeftSubject.next(topLeft);
  }
  setTopRight(topRight: number) {
    this.topRightSubject.next(topRight);
  }
  setBottomLeft(bottomLeft: number) {
    this.bottomLeftSubject.next(bottomLeft);
  }
  setBottomRight(bottomRight: number) {
    this.bottomRightSubject.next(bottomRight);
  }


}
