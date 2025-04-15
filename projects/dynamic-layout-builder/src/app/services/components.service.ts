import { ComponentRef, EventEmitter, inject, Injectable, Signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { AtomicElementData, ContainerData, LayoutElement, LayoutModel } from '../interfaces/layout-elements';
import { BehaviorSubject, filter } from 'rxjs';
import { LayoutData } from '../interfaces/layout-elements'

@Injectable({
  providedIn: 'root'
})

export class ComponentsService {
  readonly registry = inject(ComponentRegistryService);
  private components: ComponentRef<any>[] = [];

  addComponent<T extends {}>(type: string, container: ViewContainerRef, id:string, data?: T): ComponentRef<LayoutElement<any>> | null {
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

  emitModel(layoutModel: Signal<LayoutModel<ContainerData>>, modelChange: EventEmitter<LayoutModel<any>>) {
    console.log("Emiting ", layoutModel());
    modelChange.emit({
      data: layoutModel(),
    });
  }

  onChildModelUpdate(childModel: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>), childrenModels: (WritableSignal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>)) {
    childrenModels.update(() =>
      childrenModels().map((cm) => {
        console.log("cm: ", cm, ", childModel: ", childModel);
        return (cm.data.id === (childModel.data as any).data.id || cm.data.id === (childModel as any).data.id) ? childModel : cm
      }
      )
    );
    console.log(childrenModels());

  }

  addContainer(childrenModels: (WritableSignal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>), containerDiv: ViewContainerRef) {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.addComponent('container', containerDiv, id);

    if (ref) {
      (ref.instance as any).modelChange.subscribe((childModel: LayoutModel<any>) => {
        this.onChildModelUpdate(childModel, childrenModels);
      });

      childrenModels.update((children: any) => [
        ...children,
        {
          id,
          type: 'container',
          data: ref.instance.data,
          children: []
        }
      ]);
    }
  }

  addLayoutElement(componentType: string, childrenModels: (WritableSignal<(LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[]>), containerDiv: ViewContainerRef, layoutModel: Signal<LayoutModel<ContainerData>>, modelChange: EventEmitter<LayoutModel<any>>, data?: LayoutData) {
    const id = crypto.randomUUID().split('-')[0];
    const ref = this.addComponent(componentType.toLowerCase(), containerDiv, id, data);

    if (ref) {
      (ref.instance as any).modelChange.subscribe((childModel: LayoutModel<any>) => {
        this.onChildModelUpdate(childModel, childrenModels);
      });

      if(componentType.toLowerCase() === 'container'){
        childrenModels.update((children: any) => [
          ...children,
          {
            data: ref.instance.data,
            children: []
          }
        ]);
      }
      else {
        childrenModels.update((children: any) => [
          ...children,
          {
            data: ref.instance.data,
          }
        ]);
      }
    }

    this.emitModel(layoutModel, modelChange);
  }


  isContainer(element: LayoutData) {
    return element.type === 'container';
  }

    // createLayoutFromModel(model: LayoutModel<AtomicElementData | ContainerData>, container: ViewContainerRef) {

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