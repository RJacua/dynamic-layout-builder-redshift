import { CommonModule } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { SelectionService } from '../../services/selection.service';
import { PaddingStyleService } from '../../services/styles/padding-style.service';
import { combineLatest, distinctUntilChanged, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-padding-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './padding-styles-options.component.html',
  styleUrl: './padding-styles-options.component.scss'
})
export class PaddingStylesOptionsComponent {

  private paddingStylesSvc = inject(PaddingStyleService)
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;

  defaultEnabler = this.paddingStylesSvc.defaultEnabler;
  defaultPaddingStyles = this.paddingStylesSvc.defaultPaddingStyles;
  defaultIndividualPaddingStyles = this.paddingStylesSvc.defaultIndividualPaddingStyles;
  unitOptions = this.paddingStylesSvc.unitOptions;
  defaultUnit = this.paddingStylesSvc.defaultUnit;

  enableIndividualPaddingCheckbox = new FormControl()
  paddingOptions = new FormGroup({
    padding: new FormControl<number>(0),
    unit: new FormControl<string>(''),
  });

  individualPaddingOptions = new FormGroup({
    top: new FormControl<number>(0),
    right: new FormControl<number>(0),
    bottom: new FormControl<number>(0),
    left: new FormControl<number>(0),
  })

  node = this.selectedNode();
  constructor() {

    effect(() => {
      if (!this.node) return;

      // let componentType = node.data.type;

      untracked(() => {
        this.paddingStylesSvc.setAllMissingStyles(this.defaultPaddingStyles, this.node.data.style);
        this.paddingStylesSvc.setAllMissingStyles(this.defaultIndividualPaddingStyles, this.node.data.style);
        this.paddingStylesSvc.setAllMissingEnablers(this.defaultEnabler, this.node.data.enabler);
      })
      console.log(this.node.data.enabler)

      this.paddingOptions.controls.unit.setValue(this.node.data.style.padding.replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
      this.paddingOptions.controls.padding.setValue(parseInt(this.node.data.style.padding) ?? parseInt(this.defaultPaddingStyles.padding!), { emitEvent: false });

      this.individualPaddingOptions.setValue({
        top: parseInt(this.node.data.style["padding-top"] ?? this.paddingOptions.controls.padding.value),
        right: parseInt(this.node.data.style["padding-right"] ?? this.paddingOptions.controls.padding.value),
        bottom: parseInt(this.node.data.style["padding-bottom"] ?? this.paddingOptions.controls.padding.value),
        left: parseInt(this.node.data.style["padding-left"] ?? this.paddingOptions.controls.padding.value),
      }, { emitEvent: false });

      this.enableIndividualPaddingCheckbox.setValue(this.node.data.enabler.enableIndividualPadding || this.defaultEnabler.enableIndividualPadding, { emitEvent: false });
    });
  }

  ngAfterViewInit() {

    combineLatest([
      this.paddingOptions.controls.padding.valueChanges.pipe(startWith(parseInt(this.node.data.style.padding ?? parseInt(this.defaultPaddingStyles.padding!)))),
      this.paddingOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.padding?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([padding, unit]) => {
        // console.log(this.node.data.style.padding)
        if ((padding || padding == 0) && unit && Object.values(padding).every(v => v !== null)) {
          this.paddingStylesSvc.setPadding(padding, unit);
        }
      });

    combineLatest([
      this.enableIndividualPaddingCheckbox.valueChanges.pipe(startWith(this.node.data?.enabler.enableIndividualPadding ?? this.defaultEnabler.enableIndividualPadding)),
      this.paddingOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.padding?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([individualPadding, unit]) => {
        if (individualPadding !== null && unit) {
          this.paddingStylesSvc.setIndividualPadding(individualPadding, this.individualPaddingOptions.controls, this.paddingOptions.controls.padding.value, this.paddingOptions.controls.unit.value);
        }
      });

    combineLatest([
      this.individualPaddingOptions.valueChanges.pipe(startWith(
        {
          top: parseInt(this.node.data.style["padding-top"] ?? this.paddingOptions.controls.padding.value),
          right: parseInt(this.node.data.style["padding-right"] ?? this.paddingOptions.controls.padding.value),
          bottom: parseInt(this.node.data.style["padding-bottom"] ?? this.paddingOptions.controls.padding.value),
          left: parseInt(this.node.data.style["padding-left"] ?? this.paddingOptions.controls.padding.value),
        }
      )),
      this.paddingOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.padding?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([paddings, unit]) => {
        // Verifica se todos os valores estão definidos
        console.log(this.paddingOptions.controls.padding.value)
        if (paddings && unit && Object.values(paddings).every(v => v !== null)) {
          this.paddingStylesSvc.setIndividualPaddings(paddings, unit);
        }
      });

  }
}
