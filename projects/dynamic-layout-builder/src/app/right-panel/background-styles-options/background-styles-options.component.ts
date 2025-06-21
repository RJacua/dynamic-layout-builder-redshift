import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { combineLatest, distinctUntilChanged, startWith } from 'rxjs';
import { BackgroundStylesService } from '../../services/styles/background-styles.service';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../../services/general-functions.service';

@Component({
  selector: 'app-background-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './background-styles-options.component.html',
  styleUrl: './background-styles-options.component.scss'
})
export class BackgroundStylesOptionsComponent implements OnInit {
  private bgStylesService = inject(BackgroundStylesService);
  readonly selectionSvc = inject(SelectionService)
  readonly generalSvc = inject(GeneralFunctionsService)

  selectedNode = this.selectionSvc.selectedNode;

  flexDirections = this.bgStylesService.flexDirections;
  flexDirectionDefault = this.bgStylesService.flexDirectionDefault;
  colorOpacityDefault = this.bgStylesService.colorOpacityDefault;
  BgRepeats = this.bgStylesService.BgRepeats;
  BgRepeatDefault = this.bgStylesService.BgRepeatDefault;

  BgSizes = this.bgStylesService.BgSizes;
  BgSizeDefault = this.bgStylesService.BgSizeDefault;

  objFits = this.bgStylesService.objFits;
  objFitDefault = this.bgStylesService.objFitDefault;

  containerStyles = this.bgStylesService.containerStyles;
  allStyles = this.bgStylesService.allStyles;
  imageStyles = this.bgStylesService.imageStyles;

  backgroundOptions = new FormGroup({});
  node = this.selectedNode();
  bgColorRgba = this.node.data.style["background-color"] || this.containerStyles['background-color'];
  bgColorHex = this.generalSvc.extractHex(this.bgColorRgba) ?? '#ffffff';
  colorOpacity = this.generalSvc.extractOpacity(this.bgColorRgba) ?? parseInt(this.colorOpacityDefault) * 100;



  constructor() {

    effect(() => {

      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      // console.log("Tipo selecionado:", this.selectedNode()?.data.type);

      if (this.selectedNode()?.data.type === 'container') {
        defaultStyles = this.containerStyles;
      }
      else if (this.selectedNode()?.data.type === 'image') {
        defaultStyles = this.imageStyles;
      }
      else {
        // console.log("ELSE")
        defaultStyles = this.allStyles;
      }

      untracked(() => {
        // console.log("node", node)
        this.bgStylesService.setAllMissing(defaultStyles, node.data.style);
      })
      // }
    });


  }

  ngOnInit() {
    this.setupFormControls();
    this.setupReactiveListeners();
  }


  setupFormControls() {

    const node = this.selectedNode();

    this.backgroundOptions.addControl('bgOpacity', new FormControl(''));

    if (this.selectedNode()?.data.type === 'container') {
      if (!this.backgroundOptions.contains('bgColor')) {
        this.backgroundOptions.addControl('bgColor', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('colorOpacity')) {
        this.backgroundOptions.addControl('colorOpacity', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('flexDirection')) {
        this.backgroundOptions.addControl('flexDirection', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('urlImage')) {
        this.backgroundOptions.addControl('urlImage', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('BgRepeat')) {
        this.backgroundOptions.addControl('BgRepeat', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('BgSize')) {
        this.backgroundOptions.addControl('BgSize', new FormControl(''));
      }
    }
    else if (this.selectedNode()?.data.type === 'image') {
      if (!this.backgroundOptions.contains('objFit')) {
        this.backgroundOptions.addControl('objFit', new FormControl(''));
      }
    }
    else {
      if (!this.backgroundOptions.contains('bgColor')) {
        this.backgroundOptions.addControl('bgColor', new FormControl(''));
      }
      if (!this.backgroundOptions.contains('colorOpacity')) {
        this.backgroundOptions.addControl('colorOpacity', new FormControl(''));
      }
    }


    const bgColorRgba = node.data.style["background-color"] || this.containerStyles['background-color'];
    const bgColorHex = this.generalSvc.extractHex(bgColorRgba) ?? '#ffffff';
    const colorOpacity = this.generalSvc.extractOpacity(bgColorRgba) ?? parseInt(this.colorOpacityDefault) * 100;


    if (this.selectedNode()?.data.type === 'image') {
      this.backgroundOptions.setValue({
        bgOpacity: parseFloat(node.data.style["opacity"]) * 100 || (parseInt(this.imageStyles.opacity!) * 100),
        objFit: node.data.style["object-fit"] || this.objFitDefault,
      }, { emitEvent: false });
    }
    else if (this.selectedNode()?.data.type === 'container') {
      this.backgroundOptions.setValue({
        bgColor: bgColorHex,
        colorOpacity: colorOpacity,
        bgOpacity: parseFloat(node.data.style["opacity"]) * 100 || (parseInt(this.containerStyles.opacity!) * 100),
        flexDirection: node.data.style["flex-direction"] || this.containerStyles['flex-direction'],
        urlImage: node.data.style["background-image"].substring(5, node.data.style["background-image"].length - 2) || this.containerStyles["background-image"],
        BgRepeat: node.data.style["background-repeat"] || this.containerStyles["background-repeat"],
        BgSize: node.data.style["background-size"] || this.containerStyles["background-size"],
      }, { emitEvent: false });
    }
    else {
      this.backgroundOptions.setValue({
        bgColor: bgColorHex,
        colorOpacity: colorOpacity,
        bgOpacity: parseFloat(node.data.style["opacity"]) * 100 || (parseInt(this.allStyles.opacity!) * 100),
      }, { emitEvent: false });
    }
  }


  setupReactiveListeners() {

    const bgColorControl = this.backgroundOptions.get('bgColor');
    const colorOpacityControl = this.backgroundOptions.get('colorOpacity');
    if (bgColorControl instanceof FormControl && colorOpacityControl instanceof FormControl) {
      combineLatest([
        this.backgroundOptions.get('bgColor')!.valueChanges.pipe(
          startWith(this.bgColorHex),
          // distinctUntilChanged()
        ),
        this.backgroundOptions.get('colorOpacity')!.valueChanges.pipe(
          startWith(this.colorOpacity),
          // distinctUntilChanged()
        ),
      ])
        .pipe(distinctUntilChanged())
        .subscribe(([hex, opacity]) => {
          if (hex && opacity !== null) {
            const rgba = this.generalSvc.hexToRgba(hex, opacity);
            this.bgStylesService.setBgColor(rgba);
          }
        });
    }

    const bgOpacityControl = this.backgroundOptions.get('bgOpacity');
    if (bgOpacityControl instanceof FormControl) {
      bgOpacityControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(opacity => {
          // console.log('Selected opacity:', opacity);
          if (opacity !== null) {
            this.bgStylesService.setBgOpacity(opacity);
          }
        });
    }

    const flexDirectionControl = this.backgroundOptions.get('flexDirection');
    if (flexDirectionControl instanceof FormControl) {
      flexDirectionControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(direction => {
          // console.log('Selected direction:', direction);
          if (direction !== null) {
            this.bgStylesService.setFlexDirection(direction);
          }
        });
    }

    const urlImageControl = this.backgroundOptions.get('urlImage');
    if (urlImageControl instanceof FormControl) {
      urlImageControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(url => {
          // console.log('Selected url:', url);
          if (url !== 'none') {
            this.bgStylesService.setUrlImage(url);
          }
        });
    }

    const BgRepeatControl = this.backgroundOptions.get('BgRepeat');
    if (BgRepeatControl instanceof FormControl) {
      BgRepeatControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(bgRepeat => {
          // console.log('Selected bgRepeat:', bgRepeat);
          if (bgRepeat !== 'none') {
            this.bgStylesService.setBgRepeat(bgRepeat);
          }
        });
    }

    const BgSizeControl = this.backgroundOptions.get('BgSize');
    if (BgSizeControl instanceof FormControl) {
      BgSizeControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(bgSize => {
          // console.log('Selected bgSize:', bgSize);
          if (bgSize !== 'none') {
            this.bgStylesService.setBgSize(bgSize);
          }
        });
    }

    const objFitControl = this.backgroundOptions.get('objFit');
    if (objFitControl instanceof FormControl) {
      objFitControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(objFit => {
          console.log('Selected objFit:', objFit);
          if (objFit !== 'none') {
            this.bgStylesService.setObjFit(objFit);
          }
        });
    }
  };

}

