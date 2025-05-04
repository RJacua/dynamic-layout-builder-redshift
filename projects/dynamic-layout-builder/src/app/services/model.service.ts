import { effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
  }

  canvasModel = signal<(LayoutElement<ContainerData>)[]>([]);
  private _isDone = false;  

  getNodeById(
    id: string,
    branch?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  ): LayoutElement<ContainerData> | LayoutElement<AtomicElementData> | undefined {
    const currentBranch = branch ?? this.canvasModel();
    let result: LayoutElement<any> | undefined = undefined;
  
    this._recursiveGetNodeById(id, currentBranch, this._isDone, (found) => {
      result = found;
    });
  
    this._isDone = false;
    return result;
  }
  

  private _recursiveGetNodeById(
    id: string,
    branch: LayoutElement<ContainerData>[],
    isDone: boolean,
    callback: (found: LayoutElement<any>) => void
  ) {
    for (const node of branch) {
      if (isDone) return;
  
      if (node.data.id === id) {
        callback(node);
        this._isDone = true;
        return;
      }
  
      if ('children' in node.data && node.data.children) {
        this._recursiveGetNodeById(id, node.data.children, this._isDone, callback);
      }
    }
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

    this._recursiveAddChildNode(parentId, childModel, currentBranch, this._isDone);

    this.canvasModel.set([...currentBranch]);
    this._isDone = false;
    return childModel.data.id;
  }

  private _recursiveAddChildNode(parentId: string, child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: boolean) {
    if (!isDone) {
      currentBranch.map((node) => {
        if (!isDone) {
          if (node.data.children && node.data.id === parentId) {
            node.data.children = [...node.data.children, child]
            this._isDone = true;
            return
          }

          if (node.data.children) {
            this._recursiveAddChildNode(parentId, child, node.data.children, this._isDone)
          }

        }
      })
    }
  }

  updateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, branch?: (LayoutElement<ContainerData>)[]) {
    const currentBranch = branch ?? this.canvasModel();

    this._recursiveUpdateModel(id, model, currentBranch, this._isDone);
    this.canvasModel.set([...currentBranch])

    this._isDone = false;
  }

  private _recursiveUpdateModel(id: string, model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>, currentBranch: (LayoutElement<ContainerData>)[], isDone: boolean) {
    if (!isDone) {
      currentBranch.map((node) => {
        if (!isDone) {
          if (node.data.id === id) {
            node.data = model.data;
            this._isDone = true;
            return
          }

          if (node.data.children) {
            this._recursiveUpdateModel(id, model, node.data.children, this._isDone)
          }

        }
      })
    }
  }

  removeNodeById(id: string, branch?: (LayoutElement<ContainerData>)[]) {
    
    var currentBranch = branch ?? this.canvasModel();

    if(currentBranch === this.canvasModel()){
      currentBranch = currentBranch.filter((child) => child.data.id !== id);
      if(currentBranch.length !== this.canvasModel().length){
        this._isDone = true;
      }
    }

    this._recursiveRemoveNodeById(id, currentBranch, this._isDone);
    this.canvasModel.set([...currentBranch]);
  }

  private _recursiveRemoveNodeById(id: string, currentBranch: (LayoutElement<ContainerData>)[], isDone: boolean) {

    if (!isDone) {
      currentBranch.map((node) => {
        if ('children' in node.data && node.data.children) {
          let oldLength = node.data.children.length;
          node.data.children = node.data.children.filter((child) => child.data.id !== id);
          if (oldLength > node.data.children.length){
            this._isDone = true;
          }
        }
      })

      if (!this._isDone) {
        currentBranch.map((node) => {
          if (node.data && 'children' in node.data && node.data.children)
            this._recursiveRemoveNodeById(id, node.data.children, this._isDone)
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
