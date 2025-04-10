export interface LayoutElement<T> {
  type: string;
  data: T;
}

export interface ParagraphData {
  text?: string;
}

export interface HeaderData {
  text: string;
  size: number;
  alignment?: string;
}

export interface ContainerData {
  alignment?: string;
}