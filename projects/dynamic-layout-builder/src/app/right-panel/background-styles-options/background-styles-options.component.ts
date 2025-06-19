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
  containerStyles = this.bgStylesService.containerStyles;
  allStyles = this.bgStylesService.allStyles;

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

    this.backgroundOptions.addControl('bgColor', new FormControl(''));
    this.backgroundOptions.addControl('colorOpacity', new FormControl(''));
    this.backgroundOptions.addControl('bgOpacity', new FormControl(''));

    if (this.selectedNode()?.data.type === 'container') {
      if (!this.backgroundOptions.contains('flexDirection')) {
        this.backgroundOptions.addControl('flexDirection', new FormControl(''));
      }
    }

    const bgColorRgba = node.data.style["background-color"] || this.containerStyles['background-color'];
    const bgColorHex = this.generalSvc.extractHex(bgColorRgba) ?? '#ffffff';
    const colorOpacity = this.generalSvc.extractOpacity(bgColorRgba) ?? parseInt(this.colorOpacityDefault) * 100;


    if (this.selectedNode()?.data.type !== 'container') {
      this.backgroundOptions.setValue({
        bgColor: bgColorHex,
        colorOpacity: colorOpacity,
        bgOpacity: parseFloat(node.data.style["opacity"]) * 100 || (parseInt(this.allStyles.opacity!) * 100),
      }, { emitEvent: false });
    }
    else if (this.selectedNode()?.data.type === 'container') {
      this.backgroundOptions.setValue({
        bgColor: bgColorHex,
        colorOpacity: colorOpacity,
        bgOpacity: parseFloat(node.data.style["opacity"]) * 100 || (parseInt(this.containerStyles.opacity!) * 100),
        flexDirection: node.data.style["flex-direction"] || this.containerStyles['flex-direction'],
      }, { emitEvent: false });
    }
  }


  setupReactiveListeners() {

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

  }



}
