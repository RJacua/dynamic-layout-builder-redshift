import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { distinctUntilChanged } from 'rxjs';
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
  
  BgRepeats = this.bgStylesService.BgRepeats;
  BgRepeatDefault = this.bgStylesService.BgRepeatDefault;

  BgSizes = this.bgStylesService.BgSizes;
  BgSizeDefault = this.bgStylesService.BgSizeDefault;

  containerStyles = this.bgStylesService.containerStyles;
  allStyles = this.bgStylesService.allStyles;



  backgroundOptions = new FormGroup({});
  constructor() {

    effect(() => {

      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      if (this.selectedNode()?.data.type === 'container') {
        defaultStyles = this.containerStyles;
      }
      else {
        defaultStyles = this.allStyles;
      }
      // if (Object.keys(node.data.style).length === 0) {
      // !this.generalSvc.isSubset(defaultStyles, node.data.style)
      untracked(() => {
        this.bgStylesService.setAllMissing(defaultStyles, node.data.style);
        // this.bgStylesService.setAll(defaultStyles);
      })
      // }

      this.backgroundOptions.addControl('bgColor', new FormControl(''));
      this.backgroundOptions.addControl('bgOpacity', new FormControl(''));

      if (this.selectedNode()?.data.type === 'container') {
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


      if (this.selectedNode()?.data.type !== 'container') {
        this.backgroundOptions.setValue({
          bgColor: node.data.style["background-color"] || this.allStyles['background-color'],
          bgOpacity: node.data.style["opacity"] * 100 || (parseInt(this.allStyles.opacity!) * 100),
        });
      }
      else if (this.selectedNode()?.data.type === 'container') {
        this.backgroundOptions.setValue({
          bgColor: node.data.style["background-color"] || this.containerStyles['background-color'],
          bgOpacity: node.data.style["opacity"] * 100 || (parseInt(this.containerStyles.opacity!) * 100),
          flexDirection: node.data.style["flex-direction"] || this.containerStyles['flex-direction'],
          urlImage: node.data.style["background-image"].substring(5, node.data.style["background-image"].length - 2) || this.containerStyles["background-image"],
          BgRepeat: node.data.style["background-repeat"] || this.containerStyles["background-repeat"],
          BgSize: node.data.style["background-size"] || this.containerStyles["background-size"],
        }, { emitEvent: false });
      }


    });

    effect(() => {
      const bgColorControl = this.backgroundOptions.get('bgColor');
      if (bgColorControl instanceof FormControl) {
        bgColorControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(color => {
            // console.log('Selected color:', color);
            if (color !== null) {
              this.bgStylesService.setBgColor(color);
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
    });

  }

  ngOnInit() {

  }

}
