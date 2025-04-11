export interface LayoutElement<T> {
  type: string;
  data: T;
}

export interface Styles {
  alignment?: string;
  color?: string;
  font?: string;
  size?: number;

}

export interface ParagraphData {
  type: 'paragraph';
  text?: string;
  style?: Styles;
}

export interface HeaderData {
  type: 'header';
  text: string;
  style?: Styles;
}

export interface ContainerData {
  type: 'container';
  alignment?: string;

  children?: LayoutElement<any>[];

}

export interface MemoryContent<T> {
  data: T;
  children?: MemoryContent<ParagraphData | HeaderData | ContainerData>[];
}