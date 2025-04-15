import { ElementRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type AtomicElementData = HeaderData | ParagraphData;
export interface LayoutElement<T> {
  data: T;

}

export interface LayoutData {
  id: string;
  type: string;
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
  style?: Styles;
}

export interface HeaderData extends LayoutData {
  text?: string;
  style?: Styles;
}

export interface ContainerData extends LayoutData {
  containerDiv?: ViewContainerRef;
  style?: Styles;
  children?: LayoutModel<LayoutModel<ContainerData> | LayoutElement<AtomicElementData>>[];
  elementRef?: BehaviorSubject<ViewContainerRef | null>;
}

export interface LayoutModel<T> {
  data: T;
  children?: (LayoutModel<ContainerData> | LayoutElement<AtomicElementData>)[];
}