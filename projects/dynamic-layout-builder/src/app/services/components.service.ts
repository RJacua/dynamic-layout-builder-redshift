import { ComponentRef, inject, Injectable, Signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { AtomicElementData, ContainerData, LayoutElement } from '../interfaces/layout-elements';
import { LayoutData } from '../interfaces/layout-elements'
import { ModelService } from './model.service';

@Injectable({
  providedIn: 'root'
})

export class ComponentsService {
  readonly registry = inject(ComponentRegistryService);
  readonly modelSvc = inject(ModelService);
  private components: ComponentRef<any>[] = [];

  addLayoutElement(componentType: string, containerDiv: ViewContainerRef, parentId: string, componentData?: LayoutData): LayoutElement<any> {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.addComponent(componentType.toLowerCase(), containerDiv, id, parentId, componentData);

    let style = {};

    if (!ref) {
      console.error("The Ref is in another castle");
      return {data: {}}
    }

    if(componentData?.style){
      style = componentData.style;
    }

    if (componentType.toLowerCase() === 'container') {
      console.log("container aqui");
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), style: style, children: [] }
      }
    }
    else {
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), style: style }
      }
    }

  }

  addComponent<T extends {}>(type: string, container: ViewContainerRef, id?: string, parentId?: string, data?: T): ComponentRef<LayoutElement<any>> | null {
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
    if (id) {
      componentRef.instance.data.id = id;
    }
    if (parentId) {
      componentRef.instance.data.parentId = parentId;
    }

    this.components.push(componentRef);

    return componentRef;
  }

  removeComponent(componentRef: ComponentRef<any>) {
    const index = this.components.indexOf(componentRef);
    if (index !== -1) {
      componentRef.destroy(); // remove do DOM e libera recursos
      this.components.splice(index, 1);
    }
  }





  isContainer(element: LayoutData) {
    return element.type === 'container';
  }


}