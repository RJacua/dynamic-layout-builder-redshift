import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';
import { Styles } from '../interfaces/layout-elements';

@Injectable({
  providedIn: 'root'
})
export class NewAreaMenuService {
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);

  constructor() { }
  // dataMap = new Map<string, string[]>([
  //   ["New Area Layout", ["Linear", "Flex"]],
  //   ["Insert Component", ["Heading", "Paragraph"]],
  //   ["Properties", ["Margin", "Padding"]],
  //   ["Linear",  ["Rows", "Columns"]],
  //   ["Flex",  ["Grid", "Mosaic"]],
  // ]);

  // rootLevelNodes: string[] = ["New Area Layout", "Insert Component", "Properties"];

  addMap = new Map<string, string[]>([
    ["New Container", ["Rows", "Columns"]],
    ["New Component", ["Heading", "Paragraph"]],
  ]);
  rootLevelNodesAdd: string[] = ["New Container", "New Component"];

  // newContainerMap = new Map<string, string[]>([
  //   ["New Container", ["Rows", "Columns"]],
  // ]);
  rootLevelNodes: string[] = ["New Container"];

  ActionMap() {
    return new Map<string, () => void>([
      ['Rows', () => this.addLayoutElement('container', this.selectionSvc.selectedElementId(), { "flex-direction": "row" })],
      ['Columns', () => this.addLayoutElement('container', this.selectionSvc.selectedElementId(), { "flex-direction": "column" })],
      ['Heading', () => this.addLayoutElement('header', this.selectionSvc.selectedElementId())],
      ['Paragraph', () => this.addLayoutElement('paragraph', this.selectionSvc.selectedElementId())],
    ])
  };

  getChildren(node: string) {
    return of(this.addMap.get(node));
  }

  isExpandable(node: string): boolean {
    return this.addMap.has(node);
  }

  runAction(node: string): void {
    const actionMap = this.ActionMap();
    const action = actionMap.get(node);
    if (action) {
      action();
    } else {
      console.warn(`No action defined for ${node}`);
    }
  }

  addLayoutElement(componentType: string, parentId: string, defaultStyle?: Styles) {
    const newLayoutElement = this.modelSvc.writeElementModel(componentType, parentId, undefined, defaultStyle);
    this.modelSvc.addChildNode(this.selectionSvc.selectedElementId(), newLayoutElement);
    setTimeout(() => { this.selectionSvc.select(newLayoutElement.data), 0 });
  }

}
