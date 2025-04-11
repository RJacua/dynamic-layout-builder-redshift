export interface LayoutElement<T> {
  type: string;
  data: T;
}

export interface ParagraphData {
  text?: string;
  
  alignment?: string;
}

export interface HeaderData {
  text: string;
  size: number;
  alignment?: string;
}

export interface ContainerData {
  alignment?: string;

  children?: LayoutElement<any>[];

}