import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundStylesService {

  constructor() { }

  private bgColorSubject = new BehaviorSubject<string>('#ffffff');
  private bgOpacitySubject = new BehaviorSubject<number>(1);

  bgColor$ = this.bgColorSubject.asObservable();
  bgOpacity$ = this.bgOpacitySubject.asObservable();


  setBgColor(bgColor: string) {
    this.bgColorSubject.next(bgColor);
  }
  setBgOpacity(bgOpacity: number) {
    this.bgOpacitySubject.next(bgOpacity / 100);
  }
  
}
