import { computed, effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { ContainerData, LayoutElement, AtomicElementData, LayoutData } from '../interfaces/layout-elements';

@Injectable({ providedIn: 'root' })
export class ModelService {

  constructor() {
    effect(() => {
      const canvasModel = this.canvasModel();

      untracked(() => {
        this.hasCanvasModelChanged.update(() => !this.hasCanvasModelChanged());
      })

    })
  }

  canvasModel = signal<(LayoutElement<ContainerData>)[]>([]);
  hasCanvasModelChanged = signal(false);

  getNodeSignalById(id: string) {
    const _ = this.canvasModel();
    return signal(this.getNodeById(id, this.canvasModel()));
  }

  getNodeById(
    id: string,
    branch?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  ): LayoutElement<ContainerData> | LayoutElement<AtomicElementData> | undefined {
    const currentBranch = branch ?? this.canvasModel();
    return this._recursiveGetNodeById(id, currentBranch);
  }

  private _recursiveGetNodeById(
    id: string,
    branch: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  ): LayoutElement<any> | undefined {
    for (const node of branch) {
      if (node.data.id === id) {
        return node;
      }

      if ('children' in node.data && node.data.children) {
        const found = this._recursiveGetNodeById(id, node.data.children);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
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

  addChildNode(
    parentId: string,
    childModel: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>,
    branch?: (LayoutElement<ContainerData>)[]
  ): string | undefined {
    const currentBranch = branch ?? this.canvasModel();

    if (parentId === 'canvas') {
      this.canvasModel.set([...currentBranch, childModel]);
      return childModel.data.id;
    }

    const updated = this._recursiveAddChildNode(parentId, childModel, currentBranch);

    if (updated) {
      this.canvasModel.set([...currentBranch]);
      return childModel.data.id;
    }

    return undefined;
  }

  private _recursiveAddChildNode(
    parentId: string,
    child: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>,
    branch: (LayoutElement<ContainerData>)[]
  ): boolean {
    for (const node of branch) {
      if (node.data.id === parentId && node.data.children) {
        node.data.children = [...node.data.children, child];
        return true;
      }

      if (node.data.children) {
        const added = this._recursiveAddChildNode(parentId, child, node.data.children);
        if (added) return true;
      }
    }

    return false;
  }


  updateModel(
    id: string,
    model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>,
    branch?: (LayoutElement<ContainerData>)[]
  ) {
    const currentBranch = branch ?? this.canvasModel();

    const updated = this._recursiveUpdateModel(id, model, currentBranch);

    if (updated) {
      this.canvasModel.set([...currentBranch]);
    }
  }

  private _recursiveUpdateModel(
    id: string,
    model: LayoutElement<ContainerData> | LayoutElement<AtomicElementData>,
    branch: (LayoutElement<ContainerData>)[]
  ): boolean {
    for (const node of branch) {
      if (node.data.id === id) {
        node.data = model.data;
        return true;
      }

      if (node.data.children) {
        const updated = this._recursiveUpdateModel(id, model, node.data.children);
        if (updated) return true;
      }
    }

    return false;
  }


  removeNodeById(
    id: string,
    branch?: (LayoutElement<ContainerData>)[]
  ) {
    let currentBranch = branch ?? this.canvasModel();

    const removedAtRoot = currentBranch.some(node => node.data.id === id);
    currentBranch = currentBranch.filter(node => node.data.id !== id);

    const removedInChildren = currentBranch.some(node => this._recursiveRemoveNodeById(id, node));

    if (removedAtRoot || removedInChildren) {
      this.canvasModel.set([...currentBranch]);
    }
  }

  private _recursiveRemoveNodeById(
    id: string,
    node: LayoutElement<ContainerData>
  ): boolean {
    if (!node.data.children) return false;

    const originalLength = node.data.children.length;
    node.data.children = node.data.children.filter(child => child.data.id !== id);

    const removedHere = node.data.children.length < originalLength;

    if (removedHere) return true;

    for (const child of node.data.children) {
      if (this._recursiveRemoveNodeById(id, child)) return true;
    }

    return false;
  }

  setCanvasModel(model: LayoutElement<ContainerData>[]) {
    this.canvasModel.set(model)
  }

  addChildrenTemplate(parentId: string, childrenModels: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]) {
    childrenModels.map((childModel) => this.addChildNode(parentId, childModel));
  }

}
