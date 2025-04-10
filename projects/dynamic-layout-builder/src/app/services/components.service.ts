import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { LayoutElement } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})

export class ComponentsService {

  readonly registry = inject(ComponentRegistryService);

  addComponent<T extends {}>(type: string, container: ViewContainerRef, data?: T) {
    if (!container) {
      console.error("Nenhum container fornecido.");
      return;
    }

    const componentClass = this.registry.getComponent(type);

    if (!componentClass) {
      console.error(`Componente do tipo '${type}' não registrado.`);
      return;
    }

    const componentRef = container.createComponent<LayoutElement<any>>(componentClass);
    if (data) {
      componentRef.instance.data = data;
    }
  }
}