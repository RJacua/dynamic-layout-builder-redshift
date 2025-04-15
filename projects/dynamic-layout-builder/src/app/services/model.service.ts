import { Injectable, signal } from '@angular/core';
import { LayoutModel, ContainerData, LayoutElement, AtomicElementData } from '../interfaces/layout-elements';

@Injectable()
export class ModelService {

  constructor() { }

  childrenModels = signal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);
  
}
