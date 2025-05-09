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
  style: Styles; //por enquanto, depois vamos usar a interface Styles
  enabler: Enablers; //por enquanto, depois vamos usar a interface Enablers
  
}


export interface ParagraphData extends LayoutData {
  text?: string;

}

export interface HeaderData extends LayoutData {
  text?: string;
  headerSize?: string;
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
  // Text Styles
  ['font-size']?: string;
  ['font-weight']?: string;
  color?: string;
  ['text-align']?: string;

  headerSize?: string;

  // Background Styles
  ["background-color"]?: string;
  opacity?: number;
  ["flex-direction"]?: string;

  // Border Styles
  ['border-color']?: string;
  ['border-style']?: string;

  ['border-width']?: string;

}

export interface Enablers { //vai crescer
  enableStroke?: boolean;
  
}

