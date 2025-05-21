import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CornerStylesService } from '../../services/styles/corner-styles.service';
import { distinctUntilChanged } from 'rxjs';
import { SelectionService } from '../../services/selection.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { Enablers, Styles } from '../../interfaces/layout-elements';

@Component({
  selector: 'app-corner-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './corner-styles-options.component.html',
  styleUrl: './corner-styles-options.component.scss'
})
export class CornerStylesOptionsComponent implements OnInit {
  private cornerStylesSvc = inject(CornerStylesService)
  readonly selectionSvc = inject(SelectionService);
  readonly generalSvc = inject(GeneralFunctionsService);

  selectedNode = this.selectionSvc.selectedNode;

  defaultEnabler: Enablers = {
    enableIndividualCorner: false,
  }
  defaultCornerStyles = this.cornerStylesSvc.defaultCornerStyles;
  defaultIndividualCornerStyles = this.cornerStylesSvc.defaultIndividualCornerStyles;

  strokeRadius = new FormControl<number>(0)
  enableIndividualCornerCheckbox = new FormControl()
  cornerOptions = new FormGroup({
    topLeft: new FormControl<number>(0),
    topRight: new FormControl<number>(0),
    bottomLeft: new FormControl<number>(0),
    bottomRight: new FormControl<number>(0),
  })

  constructor() {
    // this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleOptionsDefault);

    effect(() => {
      // let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      // let componentType = node.data.type;

      untracked(() => {
        this.cornerStylesSvc.setAllMissingStyles(this.defaultCornerStyles, node.data.style);
        this.cornerStylesSvc.setAllMissingStyles(this.defaultIndividualCornerStyles, node.data.style);
        this.cornerStylesSvc.setAllMissingEnablers(this.defaultEnabler, node.data.enabler);
        // console.log("STYLES: ", node.data.style);
      })
      // }

      this.strokeRadius.setValue(parseInt(node.data.style["border-radius"]) ?? parseInt(this.defaultCornerStyles['border-radius']!), { emitEvent: false });
      // console.log("EFFECT: ", this.strokeRadius.value);

      // if (this.enableIndividualCornerCheckbox.value === true) {
      this.cornerOptions.setValue({
        topLeft: parseInt(node.data.style["border-top-left-radius"]) ?? this.strokeRadius.value,
        topRight: parseInt(node.data.style["border-top-right-radius"]) ?? this.strokeRadius.value,
        bottomLeft: parseInt(node.data.style["border-bottom-left-radius"]) ?? this.strokeRadius.value,
        bottomRight: parseInt(node.data.style["border-bottom-right-radius"]) ?? this.strokeRadius.value,
      }, { emitEvent: false });
      // }

      this.enableIndividualCornerCheckbox.setValue(node.data.enabler.enableIndividualCorner || this.defaultEnabler.enableIndividualCorner, { emitEvent: false });

    });
  }

  // enableIndividualCorner$ = this.cornerStylesSvc.enableIndividualCorner$;

  // ngOnDestroy() {
  //   console.log("destroy");
  // }

  ngOnInit() {
    this.strokeRadius.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeRadius => {
        // console.log('Add strokeRadius:', strokeRadius);
        // console.log("SLIDER: ", this.strokeRadius.value);
        if (strokeRadius !== null)
          this.cornerStylesSvc.setStrokeRadius(strokeRadius);
      });

    // console.log("BETWEEN: ", this.strokeRadius.value)

    this.enableIndividualCornerCheckbox.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(individualCorner => {
        // console.log('Add individualCorner:', individualCorner);
        // console.log("CHECK: ", this.strokeRadius.value)
        if (individualCorner !== null)
          this.cornerStylesSvc.setIndividualCorner(individualCorner, this.cornerOptions.controls, this.strokeRadius.value);
      });


    this.cornerOptions.controls.topLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topLeft => {
        // console.log('Add topLeft:', topLeft);
        if (topLeft !== null)
          this.cornerStylesSvc.setTopLeft(topLeft);
      });

    this.cornerOptions.controls.topRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topRight => {
        // console.log('Add topRight:', topRight);
        if (topRight !== null)
          this.cornerStylesSvc.setTopRight(topRight);
      });

    this.cornerOptions.controls.bottomLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomLeft => {
        // console.log('Add bottomLeft:', bottomLeft);
        if (bottomLeft !== null)
          this.cornerStylesSvc.setBottomLeft(bottomLeft);
      });

    this.cornerOptions.controls.bottomRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomRight => {
        // console.log('Add bottomRight:', bottomRight);
        if (bottomRight !== null)
          this.cornerStylesSvc.setBottomRight(bottomRight);
      });

  }

}