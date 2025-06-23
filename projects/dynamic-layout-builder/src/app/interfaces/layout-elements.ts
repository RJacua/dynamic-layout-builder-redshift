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
  enabler: Enablers;
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

export interface IframeData extends LayoutData {
  src: string;
  
}

export interface ImageData extends LayoutData {
  url: string;
  alt: string;
  tooltip: string;
  
}

export interface CodeData extends LayoutData {
  codeContent: string;
  language: string;
  title: string;
  theme: string;
}

export interface Canvas<T> {
  data: T;

}

export interface CanvasData {
  id: string;

  type: string;

  children: LayoutElement<any>[];

  expandedNodes:Set<String>;

  style: Styles;
  
  enabler: Enablers;

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
  opacity?: string;
  ["flex-direction"]?: string;
   ["background-image"]?: string;
   ["background-repeat"]?: string;
   ["background-size"]?: string;
   ["object-fit"]?: string;

  // Border Styles
  ['border-color']?: string;
  ['border-style']?: string;
  ['border-width']?: string;

  // Corner Styles
  ['border-radius']?: string;
  ['border-top-left-radius']?: string;
  ['border-top-right-radius']?: string;
  ['border-bottom-left-radius']?: string;
  ['border-bottom-right-radius']?: string;

  // Padding Styles
  padding?: string;
  ['padding-top']?: string;
  ['padding-right']?: string;
  ['padding-bottom']?: string;
  ['padding-left']?: string;

  // Margin Styles
  margin?: string;
  ['margin-top']?: string;
  ['margin-right']?: string;
  ['margin-bottom']?: string;
  ['margin-left']?: string;

  // Dimension Styles
  height?: string;
  width?: string;
  ['max-height']?: string;
  ['max-width']?: string;
  ['min-height']?: string;
  ['min-width']?: string;



}

export interface Enablers { //vai crescer
  enableStroke?: boolean;
  enableIndividualCorner?: boolean;
  enableIndividualPadding?: boolean;
  enableIndividualMargin?: boolean;

}

export interface PointerResult {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  center?: boolean;
};

