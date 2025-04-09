import { Injectable, ViewContainerRef } from '@angular/core';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { AreaComponent } from '../container/container.component';
import { HeaderComponent } from '../header/header.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  //addAnyComponent, like addComponent but now abstracting the type on usage
  addComponent(componentType: string, container: ViewContainerRef) {
    if (!container) {
      console.error("No div Container found");
      return;
    }
    switch (componentType) {
      case 'area':
        container.createComponent(AreaComponent);
        break;
      case 'header':
        container.createComponent(HeaderComponent);
        break;
      case 'paragraph':
        container.createComponent(ParagraphComponent);
        break;
      default:
        console.error("Component type not found");
        break;
    }
  }

}
