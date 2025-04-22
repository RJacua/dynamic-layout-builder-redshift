import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutElement } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  private selectedElement = new BehaviorSubject<LayoutElement<any> | any>({});
  selectedElement$ = this.selectedElement.asObservable();

  // select(element: LayoutElement<any>) {
  //   this.selectedElement.next(element);
  //   console.log("id selected: ", element);
  // }

}
