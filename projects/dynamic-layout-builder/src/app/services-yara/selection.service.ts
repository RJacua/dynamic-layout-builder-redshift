import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LayoutElement {

  id: string;
  type: 'canvas' | 'container' | 'header' | 'paragraph'; // Temporary, Jacua should have a better version
  
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  private selectedElement = new BehaviorSubject<LayoutElement>({id: 'canvasId', type:'canvas'});
  selectedElement$ = this.selectedElement.asObservable();

  select(element: LayoutElement) {
    this.selectedElement.next(element);
    console.log("id selected: ", element);
  }

}
