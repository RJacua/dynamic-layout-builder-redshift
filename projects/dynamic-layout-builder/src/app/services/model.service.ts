import { computed, effect, Injectable, Signal, signal, untracked, ViewContainerRef, WritableSignal } from '@angular/core';
import { Canvas, CanvasData, ContainerData, LayoutElement, AtomicElementData, LayoutData, Styles } from '../interfaces/layout-elements';
import { Subject } from 'rxjs';

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

  canvasStyle = signal<(Styles)>({['flex-direction']: 'column'});

  expandedNodes = signal<Set<String>>(new Set());

  canvas:Signal<Canvas<CanvasData>> = computed(() => {
    return {data: {
      id: 'canvas',
      type: 'canvas',
      children: this.canvasModel(),
      expandedNodes: this.expandedNodes(),
      
      style: this.canvasStyle(),
    }};
  });

  hasCanvasModelChanged = signal(false);

  lastAddedNodeId = signal('0')

  // updatedNode = new Subject<any>();
  // this._renderUpdate.subscribe(() => {}); colocar isso no construtor no lugar do hasCanvasModelChanged


  getNodeSignalById(id: string) {
    // this.updatedNode.next({});

    const _ = this.canvasModel();
    return signal(this.getNodeById(id, this.canvasModel()));
  }

  getNodeById(
    id: string,
    branch?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]
  ): any {
    if (id === 'canvas') {
      return this.canvas();
    }
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


  writeElementModel(componentType: string, parentId: string, componentData?: LayoutData, defaultStyle?: Styles): LayoutElement<any> {
    const id = crypto.randomUUID().split('-')[0];
    let style = defaultStyle || {};
    let enabler = {};
    let children: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[] = [];
    let src = '';
    
    if (componentData?.style) {
      style = componentData.style;
    }
    if (componentData?.enabler) {
      enabler = componentData.enabler;
    }
    if ((componentData as ContainerData)?.children) {
      children = (componentData as ContainerData).children!;
    }

    if (componentType.toLowerCase() === 'container') {
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), enabler: enabler, style: style, children: children }
      }
    }
    else if(componentType.toLowerCase() === 'iframe'){
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), enabler: enabler, style: style, src: src }
      }
    }
    else {
      return {
        data: { id: id, parentId: parentId, type: componentType.toLowerCase(), enabler: enabler, style: style }
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
      this.lastAddedNodeId.set(childModel.data.id);
      return childModel.data.id;
    }

    const updated = this._recursiveAddChildNode(parentId, childModel, currentBranch);

    if (updated) {
      this.canvasModel.set([...currentBranch]);
      this.lastAddedNodeId.set(childModel.data.id);
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

  // moveNodeTo(nodeId: string, newParentId?: string) {

  //   console.log("aqui")
  //   newParentId = newParentId || 'canvas';

  //   let node = this.getNodeById(nodeId);
  //   let newParentNode = this.getNodeById(newParentId);
  //   if (nodeId === newParentId || (newParentId !== 'canvas' && newParentNode.data.id === node.data.parentId)) {
  //     return;
  //   }

  //   if (newParentId === 'canvas' || newParentNode.data.type === 'container') {

  //     node = {
  //       ...node,
  //       data: {
  //         ...node.data,
  //         'parentId': newParentId
  //       }
  //     }

  //     if (newParentId !== 'canvas') {
  //       this.removeNodeById(nodeId);
  //       this.addChildNode(newParentId, node);
  //     }
  //     else if (node.data.type === 'container') {
  //       this.removeNodeById(nodeId);
  //       this.addChildNode('canvas', node);
  //     }
  //   }
  //   else this.moveNodeTo(nodeId, newParentNode.data.parentId);
  // }

  moveNodeTo(nodeId: string, newParentId: string = 'canvas', newIndex: number = -1): void {
    let node = this.getNodeById(nodeId);
    let newParentNode = this.getNodeById(newParentId);

    if (nodeId === newParentId) {
      return;
    }
    if (newParentId !== 'canvas' && newParentNode.data.type !== 'container') {
      return this.moveNodeTo(nodeId, newParentNode.data.parentId, newIndex);
    }

    if (newParentId === 'canvas' && node.data.type !== 'container') {
      return;
    }

    this.removeNodeById(nodeId);

    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        parentId: newParentId
      }
    };

    // const parent = newParentId === 'canvas' ? this.canvasModel() : this.getNodeById(newParentId);
    const children = newParentId === 'canvas' ? this.canvasModel() : [...newParentNode.data.children];

    if (newIndex >= 0 && newIndex <= children.length) {
      children.splice(newIndex, 0, updatedNode);
    } else {
      children.push(updatedNode);
    }

    if (newParentId !== 'canvas') {
      newParentNode.data.children = children;
    }
    else {
      newParentNode = children;
    }

    if (newParentId !== 'canvas') {
      // this.removeNodeById(newParentId);
      this.updateModel(newParentId, newParentNode);
    }
    else if (node.data.type === 'container') {
      // this.removeNodeById(nodeId);
      this.canvasModel.set(newParentNode);
    }

  }


  setCanvasModel(model: LayoutElement<ContainerData>[]) {
    this.canvasModel.set(model)
  }

  resetCanvasModel() {
    this.canvasModel.set([])
  }

  addChildrenTemplate(parentId: string, childrenModels: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[]) {
    childrenModels.map((childModel) => this.addChildNode(parentId, childModel));
  }

  getGenealogicalTreeIdsById(id: string) {
    let currentId = id;
    let genealogicalTree: string[] = [];

    while (!genealogicalTree.includes('canvas')) {
      let currentNode = this.getNodeById(currentId);
      if (!currentNode) {
        return []
      }
      currentId = currentNode.data.parentId;
      // console.log(currentId);
      genealogicalTree.push(currentId);
    }

    return genealogicalTree;
  }

  unsetLastAddedId() {
    this.lastAddedNodeId.set('canvas');
  }

  isChildOf(childId: string, node: LayoutElement<ContainerData>): boolean {
    let found = false;
    if (node && node.data.children && node.data.children.length > 0) {
      node.data.children.forEach(child => {
        if (child.data.id === childId) {
          found = true;
        }
      });
    }
    return found
  }
}