import { effect, inject, Injectable, untracked } from '@angular/core';
import { BackgroundStylesService } from './backgroundStyles.service';
import { BorderStylesService } from './borderStyles.service';
import { CornerStylesService } from './cornerStyles.service';
import { SelectionService } from '../selection.service';
import { TextStylesService } from './textStyles.service';
import { combineLatest, map } from 'rxjs';
import { ModelService } from '../model.service';
import { AtomicElementData, ContainerData, Enablers, LayoutElement, Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../generalFunctions.service';

//Pergunta, ao inves de fazer o combinelatest pegando todos, pq nao dar update so no atributo, la no serviço do proprio atributo
//aqui poderia ter uma função q seria algo do tipo updateStyleInModel(tipoDoEstilo, valor), essa função pode ser injetada em 
// cada serviço que vai atualizar o modelo baseado no q foi escolhido, a logica de atualizar o modelo taria aqui, 
//mas seria usada em cada 1
//evitando duplicação de logica, mas diminuindo o tamanho do serviço aqui

@Injectable({
  providedIn: 'root'
})


export class StylesService {
  constructor() {
    effect(() => {

      untracked(() => {

      })
    })
  }

  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);
  readonly modelSvc = inject(ModelService);
  // private bgStylesService = inject(BackgroundStylesService)
  // private textStylesService = inject(TextStylesService)
  // private borderStylesService = inject(BorderStylesService)
  // private cornerStylesService = inject(CornerStylesService)

  private selectedNode = this.selectionSvc.selectedNode;

  // Background Styles
  // bgColor$ = this.bgStylesService.bgColor$;
  // bgOpacity$ = this.bgStylesService.bgOpacity$;

  // // Text Styles
  // fontSize$ = this.textStylesService.fontSize$;
  // fontWeight$ = this.textStylesService.fontWeight$;
  // fontColor$ = this.textStylesService.fontColor$;
  // horizontalAlign$ = this.textStylesService.horizontalAlign$;

  // // Border Styles
  // enableStroke$ = this.borderStylesService.enableStroke$;
  // strokeColor$ = this.borderStylesService.strokeColor$;
  // strokeStyle$ = this.borderStylesService.strokeStyle$;
  // strokeWidth$ = this.borderStylesService.strokeWidth$;

  // // Corner Styles
  // strokeRadius$ = this.cornerStylesService.strokeRadius$;
  // enableIndividualCorner$ = this.cornerStylesService.enableIndividualCorner$;
  // topLeft$ = this.cornerStylesService.topLeft$;
  // topRight$ = this.cornerStylesService.topRight$;
  // bottomLeft$ = this.cornerStylesService.bottomLeft$;
  // bottomRight$ = this.cornerStylesService.bottomRight$;

  // readonly defaultBorder = '1px solid #81828555';
  // readonly dynamicStyles$ = combineLatest([
  //   // Background Styles
  //   this.bgColor$,
  //   this.bgOpacity$,
  //   // Text Styles
  //   this.fontSize$,
  //   this.fontWeight$,
  //   this.fontColor$,
  //   this.horizontalAlign$,
  //   //  Border Styles
  //   this.enableStroke$,
  //   this.strokeColor$,
  //   this.strokeStyle$,
  //   this.strokeWidth$,
  //   // Border Radius
  //   this.strokeRadius$,
  //   // Individual Corner Radius
  //   this.enableIndividualCorner$,
  //   this.topLeft$,
  //   this.topRight$,
  //   this.bottomLeft$,
  //   this.bottomRight$
  // ]).pipe(
  //   map(([
  //     bgColor, bgOpacity,
  //     fontSize, fontWeight, fontColor, horizontalAlign,
  //     enabledStroke, strokeColor, strokeStyle, strokeWidth,
  //     strokeRadius,
  //     enableIndividualCorner, topLeft, topRight, bottomLeft, bottomRight,
  //   ]) => {
  //     const baseStyles = ({
  //       // Background Styles
  //       'background-color': bgColor,
  //       'opacity': bgOpacity,
  //       // Text Styles
  //       'font-size': fontSize + 'px',
  //       'font-weight': fontWeight,
  //       'color': fontColor,
  //       'text-align': horizontalAlign,
  //       //  Border Styles
  //       'border': enabledStroke ? `${strokeWidth}px ${strokeStyle} ${strokeColor}` : `${this.defaultBorder}`,
  //       // Border Radius
  //       'border-radius': strokeRadius + 'px',
  //     });

  //     if (enableIndividualCorner) {
  //       // Individual Corner Radius
  //       return {
  //         ...baseStyles,
  //         'border-top-left-radius': topLeft + 'px',
  //         'border-top-right-radius': topRight + 'px',
  //         'border-bottom-left-radius': bottomLeft + 'px',
  //         'border-bottom-right-radius': bottomRight + 'px',
  //       }
  //     }
  //     return baseStyles;
  //   })
  // );

  // readonly dynamicBorder$ = combineLatest([
  //   this.enableStroke$,
  //   this.strokeColor$,
  //   this.strokeStyle$,
  //   this.strokeWidth$
  // ]).pipe(
  //   map(([enabled, strokeColor, strokeStyle, strokeWidth]) =>
  //     enabled ? `${strokeWidth}px ${strokeStyle} ${strokeColor}` : `${this.defaultBorder}`)
  // );


  // readonly individualDynamicCornerRadius$ = combineLatest([
  //   this.enableIndividualCorner$,
  //   this.topLeft$,
  //   this.topRight$,
  //   this.bottomLeft$,
  //   this.bottomRight$
  // ]).pipe(
  //   map(([enable, topLeft, topRight, bottomLeft, bottomRight]) => ({
  //     'border-top-left-radius': enable ? `${topLeft}px` : '0',
  //     'border-top-right-radius': enable ? `${topRight}px` : '0',
  //     'border-bottom-left-radius': enable ? `${bottomLeft}px` : '0',
  //     'border-bottom-right-radius': enable ? `${bottomRight}px` : '0',
  //   }))
  // );

  updateSelectedNodeStyle(styleType: string, value: string) {
    var currentNode = this.selectedNode();
    if (currentNode) {

      const updatedModel = {
        ...currentNode,
        data: {
          ...currentNode.data,
          style: {
            ...currentNode.data.style,
            [styleType]: value
          }
        }
      };

      this.modelSvc.updateModel(this.selectionSvc.selectedElementId(), updatedModel);
    }
  }


  updateSelectedNodeEnabler(enablerType: string, value: boolean) {
    var currentNode = this.selectedNode();
    if (currentNode) {

      const updatedModel = {
        ...currentNode,
        data: {
          ...currentNode.data,
          enabler: {
            ...currentNode.data.enabler,
            [enablerType]: value
          }
        }
      };

      this.modelSvc.updateModel(this.selectionSvc.selectedElementId(), updatedModel);
    }
  }

  updateSelectedNodeHeaderSize(value: string) {
    var currentNode = this.selectedNode();
    if (currentNode) {

      const updatedModel = {
        ...currentNode,
        data: {
          ...currentNode.data,
          headerSize: value,
          // style: {
          //   ...currentNode.data.style,
          //   [styleType]: value
          // }
        }
      };

      this.modelSvc.updateModel(this.selectionSvc.selectedElementId(), updatedModel);
    }
  }

  setAllMissingStyles(defaultStyles: Styles, currentStyles: Styles) {
    // console.log("Default Style:", defaultStyles);

    Object.entries(defaultStyles).forEach((attr) => {
      // console.log("update", attr[0], " ->", attr[1]);
      if (!this.generalSvc.isAttributeOf(attr[0], currentStyles)) {
        this.updateSelectedNodeStyle(attr[0], attr[1]);
      }
    })
  }
  setAllMissingEnablers(defaultEnablers: Enablers, currentEnablers: Enablers) {
    // console.log("Default Style:", defaultStyles);

    Object.entries(defaultEnablers).forEach((attr) => {
      // console.log("update", attr[0], " ->", attr[1]);
      if (!this.generalSvc.isAttributeOf(attr[0], currentEnablers)) {
        this.updateSelectedNodeEnabler(attr[0], attr[1]);
      }
    })

  }

  changeToDefaultStyles(nodeStyle: Styles, defaultStyle: Styles) {
    let updatedStyle = nodeStyle;
    // console.log("changeToDefaultStyles: ", updatedStyle);
    
    Object.entries(defaultStyle).forEach((d) => {
      Object.entries(updatedStyle).forEach((u) => {
        if (u[0] === d[0]) {

          updatedStyle = {
            ...updatedStyle,
            [d[0]]: d[1]
          }
          // console.log("Update: ", updatedStyle);
        };
      })
    })

    // console.log("final: ", updatedStyle)
    return updatedStyle

  }

}


