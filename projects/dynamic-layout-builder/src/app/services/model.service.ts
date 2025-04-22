import { effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
  }

  canvasModel = signal<(LayoutElement<ContainerData>)[]>([]);

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

  writeElementModel(componentType: string, parentId: string, componentData?: LayoutData): LayoutElement<any> {
    const id = crypto.randomUUID().split('-')[0];
    let style = {};
    let children: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[] = [];
    if (componentData?.style) {
      style = componentData.style;
    }
    if ((componentData as ContainerData)?.children) {
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

  addChildNode(parentId: string, childModel: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, branch?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = branch ?? this.canvasModel();

    if (parentId === 'canvas') {
      this.canvasModel.set([...currentBranch, childModel]);
      return
    }

    var isDone = signal(false);
    this._recursiveAddChildNode(parentId, childModel, currentBranch, isDone);

    this.canvasModel.set([...currentBranch]);
  }

  private _recursiveAddChildNode(parentId: string, child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: WritableSignal<boolean>) {
    if (!isDone()) {
      currentBranch.map((node) => {
        if (!isDone()) {
          if (node.data.children && node.data.id === parentId) {
            node.data.children = [...node.data.children, child]
            isDone.set(true);
            return
          }

          if (node.data.children) {
            this._recursiveAddChildNode(parentId, child, node.data.children, isDone)
          }

        }
      })
    }
  }

  updateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, branch?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = branch ?? this.canvasModel();

    const isDone = signal(false);
    this._recursiveUpdateModel(id, model, currentBranch, isDone);
    this.canvasModel.set([...currentBranch])
  }

  private _recursiveUpdateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: WritableSignal<boolean>) {
    if (!isDone()) {
      currentBranch.map((node) => {
        if (!isDone()) {
          if (node.data.id === id) {
            node.data = model.data;
            isDone.set(true);
            return
          }

          if (node.data.children) {
            this._recursiveUpdateModel(id, model, node.data.children, isDone)
          }

        }
      })
    }
  }

  removeNodeById(id: string, branch?: (LayoutElement<ContainerData>)[]) {
    console.log("removendo node com id: ", id)
    
    var currentBranch = branch ?? this.canvasModel();
    var isDone = signal(false);

    if(currentBranch === this.canvasModel()){
      currentBranch = currentBranch.filter((child) => child.data.id !== id);
      if(currentBranch.length !== this.canvasModel().length){
        isDone.set(true);
      }
    }

    this._recursiveRemoveNodeById(id, currentBranch, isDone);
    this.canvasModel.set([...currentBranch]);
  }

  private _recursiveRemoveNodeById(id: string, currentBranch: (LayoutElement<ContainerData>)[], isDone: WritableSignal<boolean>) {

    if (!isDone()) {
      currentBranch.map((node) => {
        if ('children' in node.data && node.data.children) {
          let oldLength = node.data.children.length;
          node.data.children = node.data.children.filter((child) => child.data.id !== id);
          if (oldLength > node.data.children.length){
            isDone.set(true);
          }
        }
      })

      if (true) {
        currentBranch.map((node) => {
          if (node.data && 'children' in node.data && node.data.children)
            this._recursiveRemoveNodeById(id, node.data.children, isDone)
        })
      }
    }
  }

  setCanvasModel(model: LayoutElement<ContainerData>[]) {
    this.canvasModel.set(model)
  }

  addChildrenTemplate(parentId: string, childrenModels: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]) {
    childrenModels.map((childModel) => this.addChildNode(parentId, childModel));
  }

}
