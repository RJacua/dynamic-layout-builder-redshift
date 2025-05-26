import { CommonModule } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SelectionService } from '../../services/selection.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { DimensionStylesService } from '../../services/styles/dimension-styles.service';
import { combineLatest, distinctUntilChanged, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-dimension-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './dimension-styles-options.component.html',
  styleUrl: './dimension-styles-options.component.scss'
})
export class DimensionStylesOptionsComponent {

  private dimensionStylesSvc = inject(DimensionStylesService)
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;
  defaultDimensionsStyles = this.dimensionStylesSvc.defaultDimensionsStyles;
  defaultAutoDimensionsCheckBox = this.dimensionStylesSvc.defaultAutoDimensionsCheckBox;
  defaultAutoDimensionsStyles = this.dimensionStylesSvc.defaultAutoDimensionsStyles;
  unitOptions = this.dimensionStylesSvc.unitOptions;
  defaultUnit = this.dimensionStylesSvc.defaultUnit;


  dimensionOptions = new FormGroup({
    heightAuto: new FormControl(),
    widthAuto: new FormControl(),
    height: new FormControl<number>(0),
    hUnit: new FormControl<string>(''),
    width: new FormControl<number>(0),
    wUnit: new FormControl<string>(''),
  });

  node = this.selectedNode();
  constructor() {

    effect(() => {
      const node = this.selectedNode();
      if (!node) return;

      untracked(() => {
        this.dimensionStylesSvc.setAllMissingStyles(this.defaultAutoDimensionsStyles, node.data.style);


        this.dimensionOptions.controls.hUnit.setValue(node.data.style.height.replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
        this.dimensionOptions.controls.height.setValue(node.data.style.height === 'auto' ?
          parseInt(this.defaultDimensionsStyles.height!) : parseInt(node.data.style.height), { emitEvent: false }
        );

        this.dimensionOptions.controls.wUnit.setValue(node.data.style.width.replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
        this.dimensionOptions.controls.width.setValue(node.data.style.width === 'auto' ?
          parseInt(this.defaultDimensionsStyles.width!) : parseInt(node.data.style.width), { emitEvent: false }
        );

      })

      this.dimensionOptions.controls.heightAuto.setValue(node.data.style.height === 'auto' ? true : false, { emitEvent: false });
      this.dimensionOptions.controls.widthAuto.setValue(node.data.style.width === 'auto' ? true : false, { emitEvent: false });

    });
  }

  ngAfterViewInit() {


    this.dimensionOptions.controls.heightAuto.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(heightAuto => {
        // console.log('Selected heightAuto:', heightAuto);
        if (heightAuto) {
          this.dimensionStylesSvc.setHeightAuto();
        }
        else {
          this.dimensionStylesSvc.setHeight(parseInt(this.defaultDimensionsStyles.height!), this.defaultUnit);
        }
      });

    this.dimensionOptions.controls.widthAuto.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(widthAuto => {
        // console.log('Selected widthAuto:', widthAuto);
        if (widthAuto) {
          this.dimensionStylesSvc.setWidthAuto();
        }
        else {
          this.dimensionStylesSvc.setWidth(parseInt(this.defaultDimensionsStyles.width!), this.defaultUnit);
        }
      });


    combineLatest([
      this.dimensionOptions.controls.height.valueChanges.pipe(startWith(this.node.data.style.height === 'auto' ? parseInt(this.defaultDimensionsStyles.height!) : (parseInt(this.node.data.style.height) ?? parseInt(this.defaultDimensionsStyles.height!)))),
      this.dimensionOptions.controls.hUnit.valueChanges.pipe(startWith(this.node.data.style.height === 'auto' ? this.defaultUnit : (this.node.data.style.height?.replace(/[0-9.-]/g, '') ?? this.defaultUnit))),
    ])
      .pipe(
        tap(([height, unit]) => console.log("tap", height, unit)),
        distinctUntilChanged()
      )
      .subscribe(([height, unit]) => {
        if ((height || height == 0) && unit && Object.values(height).every(v => v !== null)) {
          console.log(height)
          console.log(unit)
          if (!this.dimensionOptions.controls.heightAuto.value) {
            this.dimensionStylesSvc.setHeight(height, unit);
          }
        }
      });

    combineLatest([
      this.dimensionOptions.controls.width.valueChanges.pipe(startWith(this.node.data.style.width === 'auto' ? parseInt(this.defaultDimensionsStyles.width!) : (parseInt(this.node.data.style.width) ?? parseInt(this.defaultDimensionsStyles.width!)))),
      this.dimensionOptions.controls.hUnit.valueChanges.pipe(startWith(this.node.data.style.width === 'auto' ? this.defaultUnit : (this.node.data.style.width?.replace(/[0-9.-]/g, '') ?? this.defaultUnit))),
    ])
      .pipe(
        tap(([width, unit]) => console.log("tap", width, unit)),
        distinctUntilChanged()
      )
      .subscribe(([width, unit]) => {
        if ((width || width == 0) && unit && Object.values(width).every(v => v !== null)) {
          console.log(width)
          console.log(unit)
          if (!this.dimensionOptions.controls.widthAuto.value) {
            this.dimensionStylesSvc.setWidth(width, unit);
          }
        }
      });

  }

}
