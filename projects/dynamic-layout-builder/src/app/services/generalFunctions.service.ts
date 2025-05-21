import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {

  constructor() { }
  isAttributeOf(attr: string, objToCheck: any): boolean {
    // console.log("AQUI: ", objToCheck)
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
}