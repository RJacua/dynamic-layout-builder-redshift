import { effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
  }

  canvasModel = signal<(LayoutElement<ContainerData>)[]>([]);

  writeElementModel(componentType: string, parentId: string, componentData?: LayoutData): LayoutElement<any> {
    const id = crypto.randomUUID().split('-')[0];
    let style = {};
    let children: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[] = [];
    if(componentData?.style){
      style = componentData.style;
    }
    if((componentData as ContainerData)?.children){
      children = (componentData as ContainerData).children!;
      console.log("children: ", children);
    }

    if (componentType.toLowerCase() === 'container') {
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), style: style, children: children }
      }
    }
    else {
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), style: style }
      }
    }
  }

  addChildNode(parentId: string, childModel: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, dataStructure?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = dataStructure ?? this.canvasModel();

    if (parentId === 'canvas') {
      this.canvasModel.set([...currentBranch, childModel]);
      return
    }

    var isDone = signal(false);
    this.__recursiveAddChildNode(parentId, childModel, currentBranch, isDone);

    this.canvasModel.set([...currentBranch]);
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
    const currentBranch = dataStructure ?? this.canvasModel();
        
    const isDone = signal(false);
    this.__recursiveUpdateModel(id, model, currentBranch, isDone);
    this.canvasModel.set([...currentBranch])
  
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
    layoutModels = layoutModels || this.canvasModel();

    layoutModels.map((lm) => {
      if ((lm as LayoutElement<ContainerData>).data.children) {
        this.getNodeById(id, (lm as LayoutElement<ContainerData>).data.children)
      }
    })

    console.log(layoutModels.find((element) => element.data.id === id));

    return layoutModels.find((element) => element.data.id === id);
  }

  setCanvasModel(model: LayoutElement<ContainerData>[]){
    this.canvasModel.set(model)
  }


}
