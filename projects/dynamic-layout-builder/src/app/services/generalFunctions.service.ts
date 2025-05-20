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

}