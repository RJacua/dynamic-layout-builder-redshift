import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorderStylesService {

  constructor() { }

  private enableStrokeSubject = new BehaviorSubject<boolean>(false);
  enableStroke$ = this.enableStrokeSubject.asObservable();

  private strokeColorSubject = new BehaviorSubject<string>('#000000');
  strokeColor$ = this.strokeColorSubject.asObservable();
  
  private strokeStyleSubject = new BehaviorSubject<string>('solid');
  strokeStyle$ = this.strokeStyleSubject.asObservable();
  
  private strokeWidthSubject = new BehaviorSubject<number>(1);
  strokeWidth$ = this.strokeWidthSubject.asObservable();


  setAddStroke(enableStroke: boolean) {
    this.enableStrokeSubject.next(enableStroke);
  }
  setStrokeColor(strokeColor: string) {
    this.strokeColorSubject.next(strokeColor);
  }
  setStrokeStyle(strokeStyle: string) {
    this.strokeStyleSubject.next(strokeStyle);
  }
  setStrokeWidth(strokeWidth: number) {
    this.strokeWidthSubject.next(strokeWidth);
  }

}
