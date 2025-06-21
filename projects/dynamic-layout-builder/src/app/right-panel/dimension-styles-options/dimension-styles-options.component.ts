import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { combineLatest, distinctUntilChanged, pipe, startWith, Subscription, tap } from 'rxjs';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { SelectionService } from '../../services/selection.service';
import { DimensionStylesService } from '../../services/styles/dimension-styles.service';

@Component({
  selector: 'app-dimension-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './dimension-styles-options.component.html',
  styleUrl: './dimension-styles-options.component.scss'
})
export class DimensionStylesOptionsComponent {

  private dimensionStylesSvc = inject(DimensionStylesService)
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = computed(() => this.selectionSvc.selectedNode());
  defaultDimensionsStyles = this.dimensionStylesSvc.defaultDimensionsStyles;
  defaultAutoDimensionsCheckBox = this.dimensionStylesSvc.defaultAutoDimensionsCheckBox;
  defaultAutoDimensionsStyles = this.dimensionStylesSvc.defaultAutoDimensionsStyles;
  defaultMaxDimensionsStyles = this.dimensionStylesSvc.defaultMaxDimensionsStyles;
  defaultMinDimensionsStyles = this.dimensionStylesSvc.defaultMinDimensionsStyles;
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

  maxDimensionOptions = new FormGroup({
    maxHeight: new FormControl<number>(0),
    maxHUnit: new FormControl<string>(''),
    maxWidth: new FormControl<number>(0),
    maxWUnit: new FormControl<string>(''),
  });

  minDimensionOptions = new FormGroup({
    minHeight: new FormControl<number>(0),
    minHUnit: new FormControl<string>(''),
    minWidth: new FormControl<number>(0),
    minWUnit: new FormControl<string>(''),
  });

  node = this.selectedNode();
  constructor() {

    effect(() => {
      const nodeId = this.selectionSvc.selectedElementId;
      if (!nodeId() || nodeId() == 'canvas') return;

      // untracked(() => {

        const node = this.selectedNode;
        this.initialSet(node());

        this.dimensionOptions.controls.heightAuto.setValue(node().data.style.height === 'auto' ? true : false, { emitEvent: false });
        this.dimensionOptions.controls.widthAuto.setValue(node().data.style.width === 'auto' ? true : false, { emitEvent: false });
      // })


    });


    // effect(() => {

    //   this.selectionSvc.selectedElementId();
    //   untracked(() => {
    //     this.allUnsub();
    //     this.allSub();
    //   });

    // });
  }

  ngAfterViewInit() {
    this.allSub();
    const node = this.selectedNode;
    if (!node()) return;

    // this.initialSet(node());
  }


  allSub() {

    this.dimensionOptions.controls.heightAuto.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(heightAuto => {
        // console.log('Selected heightAuto:', heightAuto);
        if (heightAuto) {
          this.dimensionStylesSvc.setHeightAuto();
        }
        else {
          this.dimensionStylesSvc.setHeight(parseInt(this.defaultDimensionsStyles.height!), this.defaultUnit);
          this.dimensionOptions.controls.height.setValue(this.node.data.style.height === 'auto' ?
            parseInt(this.defaultDimensionsStyles.height!) : parseInt(this.node.data.style.height));
          this.dimensionOptions.controls.hUnit.setValue(this.node.data.style.height === 'auto' ? this.defaultUnit : (this.node.data.style.height?.replace(/[0-9.-]/g, '') ?? this.defaultUnit));
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
          this.dimensionOptions.controls.width.setValue(this.node.data.style.width === 'auto' ?
            parseInt(this.defaultDimensionsStyles.width!) : parseInt(this.node.data.style.width));
          this.dimensionOptions.controls.wUnit.setValue(this.node.data.style.width === 'auto' ? this.defaultUnit : (this.node.data.style.width?.replace(/[0-9.-]/g, '') ?? this.defaultUnit));
        }
      });


    combineLatest([
      this.dimensionOptions.controls.height.valueChanges.pipe(startWith(this.node.data.style.height === 'auto' ? parseInt(this.defaultDimensionsStyles.height!) : (parseInt(this.node.data.style.height) ?? parseInt(this.defaultDimensionsStyles.height!)))),
      this.dimensionOptions.controls.hUnit.valueChanges.pipe(startWith(this.node.data.style.height === 'auto' ? this.defaultUnit : (this.node.data.style.height?.replace(/[0-9.-]/g, '') ?? this.defaultUnit))),
    ])
      .pipe(
        // tap(([height, unit]) => console.log("tap", height, unit)),
        distinctUntilChanged()
      )
      .subscribe(([height, unit]) => {
        if ((height !== null && height !== undefined) && unit) {
          // console.log(height)
          if (!this.dimensionOptions.controls.heightAuto.value) {
            this.dimensionStylesSvc.setHeight(height, unit);
          }
        }
      });

    combineLatest([
      this.dimensionOptions.controls.width.valueChanges.pipe(startWith(this.node.data.style.width === 'auto' ? parseInt(this.defaultDimensionsStyles.width!) : (parseInt(this.node.data.style.width) ?? parseInt(this.defaultDimensionsStyles.width!)))),
      this.dimensionOptions.controls.wUnit.valueChanges.pipe(startWith(this.node.data.style.width === 'auto' ? this.defaultUnit : (this.node.data.style.width?.replace(/[0-9.-]/g, '') ?? this.defaultUnit))),
    ])
      .pipe(
        // tap(([width, unit]) => console.log("tap", width, unit)),
        distinctUntilChanged()
      )
      .subscribe(([width, unit]) => {
        if ((width !== null && width !== undefined) && unit) {
          if (!this.dimensionOptions.controls.widthAuto.value) {
            this.dimensionStylesSvc.setWidth(width, unit);
          }
        }
      });

    combineLatest([
      this.maxDimensionOptions.controls.maxHeight.valueChanges.pipe(startWith(parseInt(this.node.data.style['max-height']) ?? parseInt(this.defaultMaxDimensionsStyles['max-height']!))),
      this.maxDimensionOptions.controls.maxHUnit.valueChanges.pipe(startWith(this.node.data.style['max-height']?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([maxHeight, unit]) => {
        // console.log(this.node.data.style.maxHeight)
        if ((maxHeight || maxHeight == 0) && unit && Object.values(maxHeight).every(v => v !== null)) {
          this.dimensionStylesSvc.setMaxHeight(maxHeight, unit);
        }
      });

    combineLatest([
      this.maxDimensionOptions.controls.maxWidth.valueChanges.pipe(startWith(parseInt(this.node.data.style['max-width']) ?? parseInt(this.defaultMaxDimensionsStyles['max-width']!))),
      this.maxDimensionOptions.controls.maxWUnit.valueChanges.pipe(startWith(this.node.data.style['max-width']?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([maxWidth, unit]) => {
        // console.log(this.node.data.style.maxWidth)
        if ((maxWidth || maxWidth == 0) && unit && Object.values(maxWidth).every(v => v !== null)) {
          this.dimensionStylesSvc.setMaxWidth(maxWidth, unit);
        }
      });

    combineLatest([
      this.minDimensionOptions.controls.minHeight.valueChanges.pipe(startWith(parseInt(this.node.data.style['min-height']) ?? parseInt(this.defaultMinDimensionsStyles['min-height']!))),
      this.minDimensionOptions.controls.minHUnit.valueChanges.pipe(startWith(this.node.data.style['min-height']?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([minHeight, unit]) => {
        // console.log(this.node.data.style.minHeight)
        if ((minHeight || minHeight == 0) && unit && Object.values(minHeight).every(v => v !== null)) {
          this.dimensionStylesSvc.setMinHeight(minHeight, unit);
        }
      });

    combineLatest([
      this.minDimensionOptions.controls.minWidth.valueChanges.pipe(startWith(parseInt(this.node.data.style['min-width']) ?? parseInt(this.defaultMinDimensionsStyles['min-width']!))),
      this.minDimensionOptions.controls.minWUnit.valueChanges.pipe(startWith(this.node.data.style['min-width']?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([minWidth, unit]) => {
        // console.log(this.node.data.style.minWidth)
        if ((minWidth || minWidth == 0) && unit && Object.values(minWidth).every(v => v !== null)) {
          this.dimensionStylesSvc.setMinWidth(minWidth, unit);
        }
      });
  }

  initialSet(node: any) {
    this.dimensionStylesSvc.setAllMissingStyles(this.defaultAutoDimensionsStyles, node.data.style);
    this.dimensionStylesSvc.setAllMissingStyles(this.defaultMaxDimensionsStyles, node.data.style);
    this.dimensionStylesSvc.setAllMissingStyles(this.defaultMinDimensionsStyles, node.data.style);

    this.dimensionOptions.controls.hUnit.setValue(node.data.style.height === 'auto' ? this.defaultUnit : (node.data.style.height?.replace(/[0-9.-]/g, '') ?? this.defaultUnit), { emitEvent: false });
    // console.log("initialSet: ", node.data.id);
    this.dimensionOptions.controls.wUnit.setValue(node.data.style.width === 'auto' ? this.defaultUnit : (node.data.style.width?.replace(/[0-9.-]/g, '') ?? this.defaultUnit), { emitEvent: false });

    this.dimensionOptions.controls.height.setValue(node.data.style.height === 'auto' ?
      parseInt(this.defaultDimensionsStyles.height!) : parseInt(node.data.style.height), { emitEvent: false }
    );
    this.dimensionOptions.controls.width.setValue(node.data.style.width === 'auto' ?
      parseInt(this.defaultDimensionsStyles.width!) : parseInt(node.data.style.width), { emitEvent: false }
    );

    this.maxDimensionOptions.controls.maxHUnit.setValue(node.data.style['max-height'].replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
    this.maxDimensionOptions.controls.maxHeight.setValue(parseInt(node.data.style['max-height']) ?? parseInt(this.defaultMaxDimensionsStyles['max-height']!), { emitEvent: false });

    this.maxDimensionOptions.controls.maxWUnit.setValue(node.data.style['max-width'].replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
    this.maxDimensionOptions.controls.maxWidth.setValue(parseInt(node.data.style['max-width']) ?? parseInt(this.defaultMaxDimensionsStyles['max-width']!), { emitEvent: false });

    this.minDimensionOptions.controls.minHUnit.setValue(node.data.style['min-height'].replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
    this.minDimensionOptions.controls.minHeight.setValue(parseInt(node.data.style['min-height']) ?? parseInt(this.defaultMinDimensionsStyles['min-height']!), { emitEvent: false });

    this.minDimensionOptions.controls.minWUnit.setValue(node.data.style['min-width'].replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
    this.minDimensionOptions.controls.minWidth.setValue(parseInt(node.data.style['min-width']) ?? parseInt(this.defaultMinDimensionsStyles['min-width']!), { emitEvent: false });

  }



}
