import { ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { LayoutElement } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})

export class ComponentsService {
  readonly registry = inject(ComponentRegistryService);

  addComponent<T extends {}> (type: string, container: ViewContainerRef, data?: T): ComponentRef<LayoutElement<any>> | null {
    if (!container) {
      console.error("Nenhum container fornecido.");
      return null;
    }
    
    const componentClass = this.registry.getComponent(type);
    
    if (!componentClass) {
      console.error(`Componente do tipo '${type}' não registrado.`);
      return null;
    }

    const componentRef = container.createComponent<LayoutElement<any>>(componentClass);
    if (data) {
      componentRef.instance.data = data;
    }

    return componentRef;
  }
}