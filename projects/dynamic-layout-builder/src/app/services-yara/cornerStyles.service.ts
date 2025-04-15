import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CornerStylesService {

  constructor() { }
  
  private enableIndividualCornerSubject = new BehaviorSubject<boolean>(false);
  enableIndividualCorner$ = this.enableIndividualCornerSubject.asObservable();

  private topLeftSubject = new BehaviorSubject<number>(0);
  private topRightSubject = new BehaviorSubject<number>(0);
  private bottomLeftSubject = new BehaviorSubject<number>(0);
  private bottomRightSubject = new BehaviorSubject<number>(0);

  topLeft$ = this.topLeftSubject.asObservable();
  topRight$ = this.topRightSubject.asObservable();
  bottomLeft$ = this.bottomLeftSubject.asObservable();
  bottomRight$ = this.bottomRightSubject.asObservable();


  setIndividualCorner(individualCorner: boolean) {
    this.enableIndividualCornerSubject.next(individualCorner);
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
