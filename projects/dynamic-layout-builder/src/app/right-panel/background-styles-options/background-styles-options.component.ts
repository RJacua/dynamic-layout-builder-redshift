import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { distinctUntilChanged } from 'rxjs';
import { BackgroundStylesService } from '../../services/styles/backgroundStyles.service';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { Styles } from '../../interfaces/layout-elements';

@Component({
  selector: 'app-background-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule],
  templateUrl: './background-styles-options.component.html',
  styleUrl: './background-styles-options.component.scss'
})
export class BackgroundStylesOptionsComponent implements OnInit {
  private bgStylesService = inject(BackgroundStylesService);
  readonly selectionSvc = inject(SelectionService)
  selectedNode = this.selectionSvc.selectedNode;

  flexDirections = [
    { value: 'row', label: 'Row' },
    { value: 'row-reverse', label: 'Row Reverse' },
    { value: 'column', label: 'Column' },
    { value: 'column-reverse', label: 'Column Reverse' }
  ];
  flexDirectionDefault = this.flexDirections[2].value;

  containerStyles: Styles = {
    ["background-color"]: '#ffffff',
    opacity: 1,
    ['flex-direction']: this.flexDirectionDefault,
  };

  allStyles: Styles = {
    ["background-color"]: '#ffffff',
    opacity: 1,
  };
  // bgColor = new FormControl<string>('#ffffff');
  // bgOpacity = new FormControl<number>(100);

  generalOptions = new FormGroup({});
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
            if (Object.keys(node.data.style).length === 0) {
              untracked(() =>
                this.bgStylesService.setAll(defaultStyles)
              )
            }

      this.generalOptions.addControl('bgColor', new FormControl(''));
      this.generalOptions.addControl('bgOpacity', new FormControl(''));

      if (this.selectedNode()?.data.type === 'container') {
        if (!this.generalOptions.contains('flexDirection')) {
          this.generalOptions.addControl('flexDirection', new FormControl(''));
        }
      }


      if (this.selectedNode()?.data.type !== 'container') {
        this.generalOptions.setValue({
          bgColor: node.data.style["background-color"] || '#ffffff',
          bgOpacity: node.data.style["opacity"] * 100 || 100,
        });
      }
      else if (this.selectedNode()?.data.type === 'container') {
        this.generalOptions.setValue({
          bgColor: node.data.style["background-color"] || '#ffffff',
          bgOpacity: node.data.style["opacity"] * 100 || 100,
          flexDirection: node.data.style["flex-direction"] || this.flexDirectionDefault,
        });
      }


    });

    effect(() => {
      const bgColorControl = this.generalOptions.get('bgColor');
      if (bgColorControl instanceof FormControl) {
        bgColorControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(color => {
            console.log('Selected color:', color);
            if (color !== null) {
              this.bgStylesService.setBgColor(color);
            }
          });
      }

      const bgOpacityControl = this.generalOptions.get('bgOpacity');
      if (bgOpacityControl instanceof FormControl) {
        bgOpacityControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(opacity => {
            console.log('Selected opacity:', opacity);
            if (opacity !== null) {
              this.bgStylesService.setBgOpacity(opacity);
            }
          });
      }

      const flexDirectionControl = this.generalOptions.get('flexDirection');
      if (flexDirectionControl instanceof FormControl) {
        flexDirectionControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(direction => {
            console.log('Selected direction:', direction);
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
