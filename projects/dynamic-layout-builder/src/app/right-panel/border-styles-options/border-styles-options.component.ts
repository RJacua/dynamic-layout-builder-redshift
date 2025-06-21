import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BorderStylesService } from '../../services/styles/border-styles.service';
import { CornerStylesService } from '../../services/styles/corner-styles.service';
import { combineLatest, distinctUntilChanged, startWith } from 'rxjs';
import { Enablers, Styles } from '../../interfaces/layout-elements';
import { SelectionService } from '../../services/selection.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { CornerStylesOptionsComponent } from '../corner-styles-options/corner-styles-options.component';

@Component({
  selector: 'app-border-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './border-styles-options.component.html',
  styleUrl: './border-styles-options.component.scss'
})
export class BorderStylesOptionsComponent implements OnInit {
  private borderStylesSvc = inject(BorderStylesService);
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;

  strokeStyleOptions = [
    { value: 'dotted', label: 'Dotted' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'solid', label: 'Solid' },
    { value: 'double', label: 'Double' }
  ];
  strokeStyleOptionsDefault = this.strokeStyleOptions[2].value;

  defaultEnabler = this.borderStylesSvc.defaultEnabler;
  containerStyles = this.borderStylesSvc.defaultContainerStyles;
  componentStyles = this.borderStylesSvc.defaultComponentStyles;
  colorOpacityDefault = this.borderStylesSvc.colorOpacityDefault;
  enableStrokeCheckbox = new FormControl();
  strokeOptions = new FormGroup({
    strokeColor: new FormControl<string>(''),
    colorOpacity: new FormControl<number>(0),
    strokeStyle: new FormControl<string>(''),
    strokeWidth: new FormControl<number>(0),
  })

  node = this.selectedNode();
  componentType = this.node.data.type;
  bgColorRgba = this.node.data.style["border-color"] || ((this.componentType === 'container' || this.componentType === 'canvas') ? this.containerStyles['border-color'] : '');
  bgColorHex = this.generalSvc.extractHex(this.bgColorRgba) ?? '#ffffff';
  colorOpacity = this.generalSvc.extractOpacity(this.bgColorRgba) ?? parseInt(this.colorOpacityDefault) * 100;



  constructor() {
    // this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleOptionsDefault);

    effect(() => {
      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      let componentType = node.data.type;

      if (componentType === 'container' || componentType === 'canvas') {
        defaultStyles = this.containerStyles;
      }
      else {
        defaultStyles = this.componentStyles;
      }
      // if (Object.keys(node.data.style).length < 60) {
      // !this.generalSvc.isSubset(defaultStyles, node.data.style)
      untracked(() => {
        this.borderStylesSvc.setAllMissingStyles(defaultStyles, node.data.style);
        this.borderStylesSvc.setAllMissingEnablers(this.defaultEnabler, node.data.enabler);
      })
      // }

      this.enableStrokeCheckbox.setValue(node.data.enabler.enableStroke || this.defaultEnabler.enableStroke);

      const bgColorRgba = node.data.style["border-color"] || ((componentType === 'container' || componentType === 'canvas') ? this.containerStyles['border-color'] : '');
      const bgColorHex = this.generalSvc.extractHex(bgColorRgba) ?? '#000000';
      const colorOpacity = this.generalSvc.extractOpacity(bgColorRgba) ?? parseInt(this.colorOpacityDefault) * 100;


      this.strokeOptions.setValue({
        strokeColor: bgColorHex,
        colorOpacity: colorOpacity,
        strokeStyle: node.data.style["border-style"] || ((componentType === 'container' || componentType === 'canvas') ? this.containerStyles['border-style'] : ''),
        strokeWidth: parseInt(node.data.style["border-width"]) || ((componentType === 'container' || componentType === 'canvas') ? parseInt(this.containerStyles['border-width']!) : 0),
      }, { emitEvent: false });


    });
  }

  // enableStroke$ = this.borderStylesService.enableStroke$;

  ngOnInit() {

    this.enableStrokeCheckbox.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(stroke => {
        // console.log('Add stroke:', stroke);
        if (stroke !== null)
          this.borderStylesSvc.setAddStroke(stroke);
      });


    // this.strokeOptions.controls.strokeColor.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(strokeColor => {
    //     // console.log('Add strokeColor:', strokeColor);
    //     if (strokeColor !== null)
    //       this.borderStylesSvc.setStrokeColor(strokeColor);
    //   });


    combineLatest([
      this.strokeOptions.get('strokeColor')!.valueChanges.pipe(
        startWith(this.bgColorHex),
        // distinctUntilChanged()
      ),
      this.strokeOptions.get('colorOpacity')!.valueChanges.pipe(
        startWith(this.colorOpacity),
        // distinctUntilChanged()
      ),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([hex, opacity]) => {
        if (hex && opacity !== null) {
          const rgba = this.generalSvc.hexToRgba(hex, opacity);
          this.borderStylesSvc.setStrokeColor(rgba);
        }
      });


    this.strokeOptions.controls.strokeStyle.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeStyle => {
        // console.log('Add strokeStyle:', strokeStyle);
        if (strokeStyle !== null)
          this.borderStylesSvc.setStrokeStyle(strokeStyle);
      });

    this.strokeOptions.controls.strokeWidth.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeWidth => {
        // console.log('Add strokeWidth:', strokeWidth);
        if (strokeWidth !== null)
          this.borderStylesSvc.setStrokeWidth(strokeWidth);
      });

  }


}
