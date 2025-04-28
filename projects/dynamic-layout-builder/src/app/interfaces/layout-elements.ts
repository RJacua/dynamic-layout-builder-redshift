import { ElementRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type AtomicElementData = HeaderData | ParagraphData;

export interface LayoutElement<T> {
  data: T;

}

export interface LayoutData {
  id: string;
  parentId: string;
  type: string;
  style: any; //por enquanto, depois vamos usar a interface Stykes

}

export interface ParagraphData extends LayoutData {
  text?: string;
}

export interface HeaderData extends LayoutData {
  text?: string;
}

export interface ContainerData extends LayoutData {
  containerDiv?: ViewContainerRef;
  elementRef?: BehaviorSubject<ViewContainerRef | null>;
  children?: (LayoutElement<ContainerData> | LayoutElement<AtomicElementData>)[];
}


export interface Canvas {
  id: string;

  type: string;

  children: LayoutElement<any>[];

}

export interface Styles { //vai crescer
  alignment?: string;
  direction?: string;
  color?: string;
  font?: string;
  size?: number;

}