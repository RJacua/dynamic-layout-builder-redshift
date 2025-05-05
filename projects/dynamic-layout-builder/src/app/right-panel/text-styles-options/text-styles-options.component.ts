import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { TextStylesService } from '../../services/styles/textStyles.service';
import { distinctUntilChanged } from 'rxjs';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-text-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './text-styles-options.component.html',
  styleUrl: './text-styles-options.component.scss'
})
export class TextStylesOptionsComponent implements OnInit {
  private textStylesService = inject(TextStylesService)
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService)

  // id = '0';
  // node = signal(this.modelSvc.getNodeById(this.id));
  // dynamicStyle = signal(this.node()?.data.style);
  selectedNode = this.selectionSvc.selectedNode;

  hOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];
  hOptionDefault = this.hOptions[1].value;

  fontOptions = new FormGroup({
    fontSize: new FormControl<number>(16),
    fontWeight: new FormControl<number>(400),
    fontColor: new FormControl<string>('#000000'),
    horizontalAlign: new FormControl<string>('center'),
  });

  constructor() {
    // this.fontOptions.controls.horizontalAlign.setValue(this.hOptionDefault);

    effect(() => {
      const node = this.selectedNode();
      if (!node) return;
    
      this.fontOptions.setValue({
        fontSize: parseInt(node.data.style["font-size"]) || 16,
        fontWeight: parseInt(node.data.style["font-weight"]) || 400,
        fontColor: node.data.style["color"] || '#000000',
        horizontalAlign: node.data.style["text-align"] || this.hOptionDefault,
      });
    });
  }

  ngOnInit() {
    // this.id = this.selectionSvc.selectedElementId();

    this.fontOptions.controls.fontSize.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(size => {
        // console.log('Selected size:', size);
        if (size !== null)
          this.textStylesService.setfontSize(size);
      });

    this.fontOptions.controls.fontWeight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(weight => {
        // console.log('Selected wight:', weight);
        if (weight !== null)
          this.textStylesService.setfontWeight(weight);
      });

    this.fontOptions.controls.fontColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(color => {
        // console.log('Selected color:', color);
        if (color !== null)
          this.textStylesService.setfontColor(color);
      });

    this.fontOptions.controls.horizontalAlign.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(hAlign => {
        // console.log('Selected hAlign:', hAlign);
        if (hAlign !== null)
          this.textStylesService.setHorizontalAlign(hAlign);
      });

  }
}