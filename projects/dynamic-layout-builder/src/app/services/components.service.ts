import { ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { AtomicElementData, ContainerData, LayoutElement, LayoutModel } from '../interfaces/layout-elements';
import { BehaviorSubject, filter } from 'rxjs';
import { LayoutData } from '../interfaces/layout-elements'

@Injectable({
  providedIn: 'root'
})

export class ComponentsService {
  readonly registry = inject(ComponentRegistryService);

  addComponent<T extends {}>(type: string, container: ViewContainerRef, data?: T): ComponentRef<LayoutElement<any>> | null {
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

  createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container: ViewContainerRef) {

    const element = this.addComponent(model.data.type, container, model.data);

    if (!element) {
      return;
    }

    if (this.isContainer(model.data)) {
      ((element.instance as any).elementRef as BehaviorSubject<ViewContainerRef | null>).pipe(
        filter((value) => !!value)
      ).subscribe((elementRef) => {

        console.log(element);
        model.children?.map(
          (c) => {
            if (this.isContainer(c.data)) {
              this.createLayoutFromModel(c, elementRef);
            }
            else this.addComponent(c.data.type, elementRef, c.data)
          }
        )
      })
    }
  }


  isContainer(element: LayoutData) {
    return element.type === 'container';
  }
}