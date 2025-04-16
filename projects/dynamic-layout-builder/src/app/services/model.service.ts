import { effect, Injectable, signal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
    effect(() => console.log("no serviço: ", this.childrenModels()))
  }

  childrenModels = signal<(LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);


  addChildModel(parentId: string, child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, layoutModels?: (LayoutElement<ContainerData>)[]) {
    if (!layoutModels) {
      console.log("NOT layout", layoutModels)
      layoutModels = this.childrenModels();
    }

    if (parentId === 'canvas') {
      this.childrenModels.set([...layoutModels, child]);
      return
    }

    var isDone = false;
    this.__recursiveAddChildModel(parentId, child, layoutModels, isDone);

    this.childrenModels.set([...layoutModels]);
  }

  private __recursiveAddChildModel(parentId: string, child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, layoutModels: (LayoutElement<ContainerData>)[], isDone: boolean) {
    if (!isDone) {
      layoutModels.map((lm) => {
        if (!isDone) {
          if (lm.data.children && lm.data.id === parentId) {
            lm.data.children = [...lm.data.children, child]
            isDone = true;
            return
          }

          if (lm.data.children) {
            this.__recursiveAddChildModel(parentId, child, lm.data.children, isDone)
          }

        }
      })
    }
  }

  // createChildModel(parentId: string, componentType: string, data?: Partial<LayoutData>):(LayoutElement<AtomicElementData> | LayoutElement<ContainerData>) {
  //   const id = crypto.randomUUID().split('-')[0];
  //   const model = {
  //     data: {id:id, parentId: parentId, type: componentType, data}
  //   };

  //   return model;
  // }

  getElementById(id: string, layoutModels?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]) {
    layoutModels = layoutModels || this.childrenModels();

    layoutModels.map((lm) => {
      if ((lm as LayoutElement<ContainerData>).data.children) {
        this.getElementById(id, (lm as LayoutElement<ContainerData>).data.children)
      }
    })

    return layoutModels.find((element) => element.data.id === id);
  }
}
