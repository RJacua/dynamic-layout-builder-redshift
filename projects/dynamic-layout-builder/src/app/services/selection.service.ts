import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AtomicElementData, ContainerData, LayoutElement } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  private selectedElement = new BehaviorSubject<ContainerData | AtomicElementData | any>({});
  selectedElement$ = this.selectedElement.asObservable();

  select(element: ContainerData | AtomicElementData) {
    this.selectedElement.next(element);
    console.log("id selected: ", element);
  }

}
