import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LayoutElement {

  type: 'canvas' | 'container' | 'header' | 'paragraph'; // Temporary, Jacua should have a better version
  
}


@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  private selectedElement = new BehaviorSubject<LayoutElement | null>(null);
  selectedElement$ = this.selectedElement.asObservable();

  select(element: LayoutElement) {
    this.selectedElement.next(element);
  }

}
