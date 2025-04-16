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

  addComponent<T extends {}>(type: string, container: ViewContainerRef, id: string, parentId: string, data?: T): ComponentRef<LayoutElement<any>> | null {
    // console.log(`criando componente do tipo ${type} e id ${id}`);
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

    componentRef.instance.data.id = id;

    componentRef.instance.data.parentId = parentId;

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

  // emitModel(layoutModel: Signal<LayoutModel<ContainerData>>, modelChange: EventEmitter<LayoutModel<any>>) {
  //   console.log("Emiting ", layoutModel());
  //   modelChange.emit({
  //     data: layoutModel().data,
  //   });
  // }

  // onChildModelUpdate(childModel: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>), childrenModels: (WritableSignal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>)) {
  //   childrenModels.update(() =>
  //     childrenModels().map((cm) => {
  //       console.log("cm: ", cm, ", childModel: ", childModel);
  //       return (cm.data.id === (childModel as any).data.id) ? childModel : cm
  //     }
  //     )
  //   );
  //   console.log("onChildModelUpdate: ", childrenModels());
  // }

  addContainer(childrenModels: (Signal<(LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]>), containerDiv: ViewContainerRef, parentId: string) {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.addComponent('container', containerDiv, id, parentId);

    if (ref) {
      return {
        data: { ...ref.instance.data, children: [] }
      }
    }
    return
  }

  addLayoutElement(componentType: string, childrenModels: (WritableSignal<(LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]>), containerDiv: ViewContainerRef, parentId: string, data?: LayoutData) {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.addComponent(componentType.toLowerCase(), containerDiv, id, parentId, data);

    if (ref) {
      // (ref.instance as any).modelChange.subscribe((childModel: LayoutModel<any>) => {
      //   this.onChildModelUpdate(childModel, childrenModels);
      // });


      if (componentType.toLowerCase() === 'container') {
        console.log("container aqui");
        childrenModels.update((children: any) => [
          ...children,
          {
            data: { ...ref.instance.data, children: [] }
          }
        ]);
        return {
          data: { ...ref.instance.data, children: [] }
        }
      }
      else {
        childrenModels.update((children: any) => [
          ...children,
          {
            data: ref.instance.data,
          }
        ]);
        return {
          data: ref.instance.data
        }
      }
    }
    return
  

  // this.emitModel(layoutModel, modelChange);
}


isContainer(element: LayoutData) {
  return element.type === 'container';
}

    // renderModel(model: LayoutModel<AtomicElementData | ContainerData>, container: ViewContainerRef) {

  //   const element = this.addComponent(model.data.type, container, model.data);

  //   if (!element) {
  //     return;
  //   }

  //   if (this.isContainer(model.data)) {
  //     ((element.instance as any).elementRef as BehaviorSubject<ViewContainerRef | null>).pipe(
  //       filter((value) => !!value)
  //     ).subscribe((elementRef) => {

  //       console.log(element);
  //       model.children?.map(
  //         (c) => {
  //           if (this.isContainer(c.data)) {
  //             this.createLayoutFromModel(c, elementRef);
  //           }
  //           else this.addComponent(c.data.type, elementRef, c.data)
  //         }
  //       )
  //     })
  //   }
  // }
}