import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BorderStylesService } from './borderStyles.service';

@Injectable({
  providedIn: 'root'
})
export class CornerStylesService {
  private strokeRadiusSubject = new BehaviorSubject<number>(50);
  strokeRadius$ = this.strokeRadiusSubject.asObservable();

  private enableIndividualCornerSubject = new BehaviorSubject<boolean>(false);
  enableIndividualCorner$ = this.enableIndividualCornerSubject.asObservable();

  private topLeftSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  topLeft$ = this.topLeftSubject.asObservable();

  private topRightSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  topRight$ = this.topRightSubject.asObservable();

  private bottomLeftSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  bottomLeft$ = this.bottomLeftSubject.asObservable();

  private bottomRightSubject = new BehaviorSubject<number>(this.strokeRadiusSubject.value);
  bottomRight$ = this.bottomRightSubject.asObservable();


  setStrokeRadius(strokeRadius: number) {
    this.strokeRadiusSubject.next(strokeRadius);

    // Atualiza os valores individuais com base no geral
    this.topLeftSubject.next(strokeRadius);
    this.topRightSubject.next(strokeRadius);
    this.bottomLeftSubject.next(strokeRadius);
    this.bottomRightSubject.next(strokeRadius);
  }
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
