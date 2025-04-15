import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorderStylesService {

  constructor() { }

  private enableStrokeSubject = new BehaviorSubject<boolean>(false);
  private strokeColorSubject = new BehaviorSubject<string>('#000000');
  private strokeRadiusSubject = new BehaviorSubject<number>(0);
  private strokeStyleSubject = new BehaviorSubject<string>('solid');
  private strokeWidthSubject = new BehaviorSubject<number>(1);
  
  enableStroke$ = this.enableStrokeSubject.asObservable();
  strokeColor$ = this.strokeColorSubject.asObservable();
  strokeRadius$ = this.strokeRadiusSubject.asObservable();
  strokeStyle$ = this.strokeStyleSubject.asObservable();
  strokeWidth$ = this.strokeWidthSubject.asObservable();


  setAddStroke(enableStroke: boolean) {
    this.enableStrokeSubject.next(enableStroke);
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


}
