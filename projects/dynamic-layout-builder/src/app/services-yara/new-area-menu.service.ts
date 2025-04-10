import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewAreaMenuService {

  constructor() { }
  dataMap = new Map<string, string[]>([
    ["New Area Layout", ["Linear", "Flex"]],
    ["Insert Component", ["Heading", "Paragraph"]],
    ["Properties", ["Margin", "Padding"]],
    ["Linear",  ["Rows", "Columns"]],
    ["Flex",  ["Grid", "Mosaic"]],
  ]);

  rootLevelNodes: string[] = ["New Area Layout", "Insert Component", "Properties"];

  getChildren(node: string) {
    return of(this.dataMap.get(node));
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }

}
