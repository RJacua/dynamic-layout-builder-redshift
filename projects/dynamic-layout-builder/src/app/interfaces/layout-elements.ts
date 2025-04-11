import { ElementRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type AtomicElementData = HeaderData | ParagraphData;
export interface LayoutElement<T> {
  data: T;

}

interface LayoutData {
  type: string;
}

export interface Styles {
  alignment?: string;
  color?: string;
  font?: string;
  size?: number;

}

export interface ParagraphData extends LayoutData {
  text?: string;
  style?: Styles;
}

export interface HeaderData extends LayoutData {
  text?: string;
  style?: Styles;
}

export interface ContainerData extends LayoutData {
  containerDiv?: ViewContainerRef;
  alignment?: string;
  children?: LayoutElement<any>[];
  elementRef?: BehaviorSubject<ViewContainerRef | null>;
}

export interface LayoutModel<T> {
  data: T;
  children?: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[];
}