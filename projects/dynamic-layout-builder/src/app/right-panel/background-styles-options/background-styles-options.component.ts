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

  containerStyles = this.bgStylesService.containerStyles;
  allStyles = this.bgStylesService.allStyles;

  // flexDirections = [
  //   { value: 'row', label: 'Row' },
  //   { value: 'row-reverse', label: 'Row Reverse' },
  //   { value: 'column', label: 'Column' },
  //   { value: 'column-reverse', label: 'Column Reverse' }
  // ];
  // flexDirectionDefault = this.flexDirections[2].value;

  // containerStyles: Styles = {
  //   ["background-color"]: 'rgba(255, 255, 255,0)',
  //   opacity: "1",
  //   ['flex-direction']: this.flexDirectionDefault,
  // };

  // allStyles: Styles = {
  //   ["background-color"]: 'rgba(255,255,255,0)',
  //   opacity: "1",
  // };

  // bgColor = new FormControl<string>('rgba(255,255,255,0)');
  // bgOpacity = new FormControl<number>(100);

  backgroundOptions = new FormGroup({});
  constructor() {

    effect(() => {

      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      console.log("Tipo selecionado:", this.selectedNode()?.data.type);


      if (this.selectedNode()?.data.type === 'container') {
        defaultStyles = this.containerStyles;
      }
      else {
        console.log("ELSE")
        defaultStyles = this.allStyles;
      }
      // if (Object.keys(node.data.style).length === 0) {
      // !this.generalSvc.isSubset(defaultStyles, node.data.style)
      untracked(() => {
        console.log("node", node)
        this.bgStylesService.setAllMissing(defaultStyles, node.data.style);
        console.log("node style", node.data.style)
        // this.bgStylesService.setAll(defaultStyles);
      })
      // }

      this.backgroundOptions.addControl('bgColor', new FormControl(''));
      this.backgroundOptions.addControl('bgOpacity', new FormControl(''));

      if (this.selectedNode()?.data.type === 'container') {
        if (!this.backgroundOptions.contains('flexDirection')) {
          this.backgroundOptions.addControl('flexDirection', new FormControl(''));
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
        });
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
    });

  }

  ngOnInit() {
    // this.bgColor.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(color => {
    //     console.log('Selected bg color:', color);
    //     if (color)
    //       this.bgStylesService.setBgColor(color);
    //   });

    // this.bgOpacity.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(opacity => {
    //     console.log('Selected bg opacity:', opacity);
    //     if (opacity)
    //       this.bgStylesService.setBgOpacity(opacity);
    //   });
  }

}
