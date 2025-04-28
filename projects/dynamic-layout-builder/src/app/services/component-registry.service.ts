import { Injectable, Type } from '@angular/core';
import { LayoutElement } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ComponentRegistryService {
  private registry = new Map<string, Type<LayoutElement<any>>>();

  register<T>(type: string, component: Type<LayoutElement<T>>) {
    this.registry.set(type, component as Type<LayoutElement<any>>);
  }
  
  getComponent(type: string): Type<LayoutElement<any>> | undefined {
    return this.registry.get(type);
  }
}
