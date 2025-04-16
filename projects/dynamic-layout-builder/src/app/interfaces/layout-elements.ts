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
  style: Styles;

}

export interface Styles {
  alignment?: string;
  direction?: string;
  color?: string;
  font?: string;
  size?: number;

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


export interface Canvas<T> {
  id: string;
  model: LayoutElement<T>;
}