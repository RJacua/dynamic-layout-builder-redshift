import { CommonModule } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { SelectionService } from '../../services/selection.service';
import { MarginStyleService } from '../../services/styles/margin-styles.service';
import { combineLatest, distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'app-margin-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './margin-styles-options.component.html',
  styleUrl: './margin-styles-options.component.scss'
})
export class MarginStylesOptionsComponent {

  private marginStylesSvc = inject(MarginStyleService)
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;

  defaultEnabler = this.marginStylesSvc.defaultEnabler;
  defaultMarginStyles = this.marginStylesSvc.defaultMarginStyles;
  defaultIndividualMarginStyles = this.marginStylesSvc.defaultIndividualMarginStyles;
  unitOptions = this.marginStylesSvc.unitOptions;
  defaultUnit = this.marginStylesSvc.defaultUnit;

  enableIndividualMarginCheckbox = new FormControl()
  marginOptions = new FormGroup({
    margin: new FormControl<number>(0),
    unit: new FormControl<string>(''),
  });

  individualMarginOptions = new FormGroup({
    top: new FormControl<number>(0),
    right: new FormControl<number>(0),
    bottom: new FormControl<number>(0),
    left: new FormControl<number>(0),
  })

  node = this.selectedNode();

  constructor() {

    effect(() => {
      const node = this.selectedNode();
      if (!this.node) return;

      // let componentType = node.data.type;

      untracked(() => {
        this.marginStylesSvc.setAllMissingStyles(this.defaultMarginStyles, node.data.style);
        this.marginStylesSvc.setAllMissingStyles(this.defaultIndividualMarginStyles, node.data.style);
        this.marginStylesSvc.setAllMissingEnablers(this.defaultEnabler, node.data.enabler);
      })
      console.log(node.data.enabler)

      this.marginOptions.controls.unit.setValue(node.data.style.margin.replace(/[0-9.-]/g, '') ?? this.defaultUnit, { emitEvent: false });
      this.marginOptions.controls.margin.setValue(parseInt(node.data.style.margin) ?? parseInt(this.defaultMarginStyles.margin!), { emitEvent: false });

      this.individualMarginOptions.setValue({
        top: parseInt(node.data.style["margin-top"] ?? this.marginOptions.controls.margin.value),
        right: parseInt(node.data.style["margin-right"] ?? this.marginOptions.controls.margin.value),
        bottom: parseInt(node.data.style["margin-bottom"] ?? this.marginOptions.controls.margin.value),
        left: parseInt(node.data.style["margin-left"] ?? this.marginOptions.controls.margin.value),
      }, { emitEvent: false });

      this.enableIndividualMarginCheckbox.setValue(node.data.enabler.enableIndividualMargin || this.defaultEnabler.enableIndividualMargin, { emitEvent: false });
    });
  }

ngAfterViewInit() {

    combineLatest([
      this.marginOptions.controls.margin.valueChanges.pipe(startWith(parseInt(this.node.data.style.margin ?? parseInt(this.defaultMarginStyles.margin!)))),
      this.marginOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.margin?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([margin, unit]) => {
        // console.log(this.node.data.style.margin)
        if ((margin || margin == 0) && unit && Object.values(margin).every(v => v !== null)) {
          this.marginStylesSvc.setMargin(margin, unit);
        }
      });

    combineLatest([
      this.enableIndividualMarginCheckbox.valueChanges.pipe(startWith(this.node.data?.enabler.enableIndividualMargin ?? this.defaultEnabler.enableIndividualMargin)),
      this.marginOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.margin?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([individualMargin, unit]) => {
        if (individualMargin !== null && unit) {
          this.marginStylesSvc.setIndividualMargin(individualMargin, this.individualMarginOptions.controls, this.marginOptions.controls.margin.value, this.marginOptions.controls.unit.value);
        }
      });

    combineLatest([
      this.individualMarginOptions.valueChanges.pipe(startWith(
        {
          top: parseInt(this.node.data.style["margin-top"] ?? this.marginOptions.controls.margin.value),
          right: parseInt(this.node.data.style["margin-right"] ?? this.marginOptions.controls.margin.value),
          bottom: parseInt(this.node.data.style["margin-bottom"] ?? this.marginOptions.controls.margin.value),
          left: parseInt(this.node.data.style["margin-left"] ?? this.marginOptions.controls.margin.value),
        }
      )),
      this.marginOptions.controls.unit.valueChanges.pipe(startWith(this.node.data.style.margin?.replace(/[0-9.-]/g, '') ?? this.defaultUnit)),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(([margins, unit]) => {
        // Verifica se todos os valores estão definidos
        console.log(this.marginOptions.controls.margin.value)
        if (margins && unit && Object.values(margins).every(v => v !== null)) {
          this.marginStylesSvc.setIndividualMargins(margins, unit);
        }
      });

  }
}
