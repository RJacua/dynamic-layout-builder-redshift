import { inject, Injectable, signal } from '@angular/core';
import { Styles } from '../interfaces/layout-elements';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {
  readonly selectionSvc = inject(SelectionService);

  constructor() { }
  isAttributeOf(attr: string, objToCheck: any): boolean {
    if (objToCheck === undefined) return false;
    let found = false;

    Object.entries(objToCheck).forEach((a) => {
      if (a[0] === attr) {
        found = true;
      }
      // console.log("found: ", found, " a[0]: ", a[0])
    })
    // console.log("return: ", found)
    return found
  }

  capitalize(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  moveKeyToFirst(obj: Record<string, any>, keyToPrioritize: string): Record<string, any> {
    if (!(keyToPrioritize in obj)) {
      console.warn('Key Not Founf')
      return obj;
    }

    const { [keyToPrioritize]: prioritizedValue, ...rest } = obj;

    return {
      [keyToPrioritize]: prioritizedValue,
      ...rest
    };
  }

  ConvertBorderRadiusStyle(styles: Styles, width: number, height: number) {
    const convertedStyles: Styles = {};
    Object.entries(styles).forEach((attr) => {
      if (attr[0].endsWith('radius')) {
        this.updateLayerStyle(convertedStyles, attr[0], this.computeBorderRadius(width, height, parseInt(attr[1])).toString() + 'px')
      }
      else
        this.updateLayerStyle(convertedStyles, attr[0], attr[1])
    })
    // console.log(convertedStyles)
    return signal(convertedStyles);
  }


  computeBorderRadius(width: number, height: number, normalizedValue: number): number {
    const minDim = Math.min(width, height);
    const radius = (normalizedValue / 100) * (minDim*(1.25) / 2);

    // console.log("max: ", minDim, "normal: ", normalizedValue, "rad: ", radius);

    return Math.floor(radius);
  }

  filterStyles(styles: Styles) {
    const attributesToFilter = ['max-height', 'max-width', 'min-height', 'min-width'];
    const filtererStyles: Styles = {};

    Object.entries(styles).forEach((attr) => {
      // console.log(attr[0], attributesToFilter[0])
      if (attributesToFilter.includes(attr[0])) {
        if (parseInt(attr[1]) !== 0)
          this.updateLayerStyle(filtererStyles, attr[0], attr[1])
      }
      else
        this.updateLayerStyle(filtererStyles, attr[0], attr[1])
    })
    return signal(filtererStyles);
  }

  getSplitStyles(styles: Styles): { outer: Styles; inner: Styles } {
    const outer: Styles = {};
    const inner: Styles = {};

    Object.entries(styles).forEach((attr) => {
      if (attr[0].startsWith('margin')) {
        this.updateLayerStyle(outer, attr[0], attr[1]);
      }
      else {
        this.updateLayerStyle(inner, attr[0], attr[1]);
      }
    })

    return { outer, inner };
  }

  updateLayerStyle(layer: Styles, styleType: string, value: string) {
    // return {
    //   ...layer,
    //   [styleType]: value
    // };
    layer[styleType as keyof Styles] = value;
  }


  customStringify(obj: any, indent = 2): string {
    const noQuoteKeys = new Set([
      "id", "parentId", "type", "data", "expandedNodes", "style", "children",
      "text", "headerSize", "enabler", "enableStroke",
      "enableIndividualCorner", "enableIndividualPadding", "enableIndividualMargin"
    ]);

    function format(value: any, level: number): string {
      const space = " ".repeat(level * indent);

      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return `[\n${value.map(item => space + " ".repeat(indent) + format(item, level + 1)).join(',\n')}\n${space}]`;
      }

      if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value);
        if (entries.length === 0) return "{}";

        const formatted = entries.map(([key, val]) => {
          const displayKey = noQuoteKeys.has(key) ? key : `"${key}"`;
          return `${" ".repeat((level + 1) * indent)}${displayKey}: ${format(val, level + 1)}`;
        });

        return `{\n${formatted.join(',\n')}\n${space}}`;
      }

      if (typeof value === "string") {
        return `"${value}"`;
      }
      return String(value);
    }

    return format(obj, 0);
  }

  hexToRgba(hex: string, opacityPercent: number): string {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
  
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    const alpha = Math.min(Math.max(opacityPercent / 100, 0), 1); // garante entre 0 e 1
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  extractOpacity(rgba: string): number | null {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (!match) return null;
    return parseFloat(match[4]) * 100;
  }
  
  extractHex(rgba: string): string | null {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
  
    const [r, g, b] = match.slice(1, 4).map(n => Number(n));
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

}