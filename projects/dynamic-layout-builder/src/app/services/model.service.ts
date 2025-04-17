import { effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
    // effect(() => console.log("no serviço: ", this.childrenModels()))
  }

  childrenModels = signal<(LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]>([]);

  writeElementModel(componentType: string, parentId: string, componentData?: LayoutData): LayoutElement<any> {
    const id = crypto.randomUUID().split('-')[0];
    let style = {};
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

  addChildNode(parentId: string, childModel: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, dataStructure?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = dataStructure ?? this.childrenModels();

    if (parentId === 'canvas') {
      this.childrenModels.set([...currentBranch, childModel]);
      return
    }

    var isDone = signal(false);
    this.__recursiveAddChildNode(parentId, childModel, currentBranch, isDone);

    this.childrenModels.set([...currentBranch]);
  }

  private __recursiveAddChildNode(parentId: string, child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: WritableSignal<boolean>) {
    if (!isDone()) {
      currentBranch.map((node) => {
        if (!isDone()) {
          if (node.data.children && node.data.id === parentId) {
            node.data.children = [...node.data.children, child]
            isDone.set(true);
            return
          }

          if (node.data.children) {
            this.__recursiveAddChildNode(parentId, child, node.data.children, isDone)
          }

        }
      })
    }
  }

  updateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, dataStructure?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = dataStructure ?? this.childrenModels();
    
    
    console.log("fora: ", currentBranch)
    
    const isDone = signal(false);
    this.__recursiveUpdateModel(id, model, currentBranch, isDone);
    this.childrenModels.set([...currentBranch])
  
  }

  private __recursiveUpdateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: WritableSignal<boolean>) {
    if (!isDone()) {
      currentBranch.map((node) => {
        if (!isDone()) {
          if (node.data.id === id) {
            node.data = model.data;
            isDone.set(true);
            return
          }

          if (node.data.children) {
            this.__recursiveUpdateModel(id, model, node.data.children, isDone)
          }

        }
      })
    }
  }

  getNodeById(id: string, layoutModels?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]) {
    layoutModels = layoutModels || this.childrenModels();

    layoutModels.map((lm) => {
      if ((lm as LayoutElement<ContainerData>).data.children) {
        this.getNodeById(id, (lm as LayoutElement<ContainerData>).data.children)
      }
    })

    return layoutModels.find((element) => element.data.id === id);
  }



}
