export interface LayoutElement<T> {
  type: string;
  data: T;
}

export interface ParagraphData {
  text?: string;
}

export interface HeaderData {
  text?: string;
  size?: string;
}

export interface ContainerData {
  alignment?: string;
}