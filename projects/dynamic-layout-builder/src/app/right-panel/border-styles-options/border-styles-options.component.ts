import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BorderStylesService } from '../../services/styles/border-styles.service';
import { CornerStylesService } from '../../services/styles/corner-styles.service';
import { distinctUntilChanged } from 'rxjs';
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
    { value: 'Double', label: 'Double' }
  ];
  strokeStyleOptionsDefault = this.strokeStyleOptions[2].value;

  defaultEnabler: Enablers = {
    enableStroke: false,
  }

  containerStyles = this.borderStylesSvc.defaultContainerStyles;
  componentStyles = this.borderStylesSvc.defaultComponentStyles;
  enableStrokeCheckbox = new FormControl();
  strokeOptions = new FormGroup({
    strokeColor: new FormControl<string>(''),
    strokeStyle: new FormControl<string>(''),
    strokeWidth: new FormControl<number>(0),
  })


  constructor() {
    // this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleOptionsDefault);

    effect(() => {
      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      let componentType = node.data.type;

      if (componentType === 'container') {
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

      
      this.strokeOptions.setValue({
        strokeColor: node.data.style["border-color"] || (componentType === 'container' ? this.containerStyles['border-color'] : ''),
        strokeStyle: node.data.style["border-style"] || (componentType === 'container' ? this.containerStyles['border-style'] : ''),
        strokeWidth:  parseInt(node.data.style["border-width"]) || (componentType === 'container' ? parseInt(this.containerStyles['border-width']!) : 0),
      });


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


    this.strokeOptions.controls.strokeColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeColor => {
        // console.log('Add strokeColor:', strokeColor);
        if (strokeColor !== null)
          this.borderStylesSvc.setStrokeColor(strokeColor);
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
