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
  readonly textStylesSvc = inject(TextStylesService)
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

  headerOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  headerOptionDefault = this.headerOptions[0];


  fontOptions = new FormGroup({
    // fontSize: new FormControl<number>(0),
    // fontWeight: new FormControl<number>(0),
    // fontColor: new FormControl<string>(''),
    // horizontalAlign: new FormControl<string>(''),
  });

  constructor() {
    // this.fontOptions.controls.horizontalAlign.setValue(this.hOptionDefault);

    effect(() => {
      const node = this.selectedNode();
      if (!node) return;

      // this.fontOptions.setValue({
      //   fontSize: parseInt(node.data.style["font-size"]) || 16,
      //   fontWeight: parseInt(node.data.style["font-weight"]) || 400,
      //   fontColor: node.data.style["color"] || '#000000',
      //   horizontalAlign: node.data.style["text-align"] || this.hOptionDefault,
      // });

      this.fontOptions.addControl('fontColor', new FormControl(''));
      this.fontOptions.addControl('horizontalAlign', new FormControl(''));

      // if (this.fontOptions.contains('fontSize')) {
      //   this.fontOptions.removeControl('fontSize');
      // }
      // if (this.fontOptions.contains('fontWeight')) {
      //   this.fontOptions.removeControl('fontWeight');
      // }

      if (this.selectedNode()?.data.type !== 'header') {
        if (!this.fontOptions.contains('fontSize')) {
          this.fontOptions.addControl('fontSize', new FormControl(0));
        }
        if (!this.fontOptions.contains('fontWeight')) {
          this.fontOptions.addControl('fontWeight', new FormControl(0));
        }
      }
      else if (this.selectedNode()?.data.type === 'header') {
        if (!this.fontOptions.contains('headerSize')) {
          this.fontOptions.addControl('headerSize', new FormControl(0));
        }
      }

      if (this.selectedNode()?.data.type !== 'header') {
        this.fontOptions.setValue({
          fontColor: node.data.style["color"] || '#000000',
          horizontalAlign: node.data.style["text-align"] || this.hOptionDefault,
          fontSize: parseInt(node.data.style["font-size"]) || 16,
          fontWeight: parseInt(node.data.style["font-weight"]) || 400,
        });
      }
      else if(this.selectedNode()?.data.type === 'header'){
        this.fontOptions.setValue({
          fontColor: node.data.style["color"] || '#000000',
          horizontalAlign: node.data.style["text-align"] || this.hOptionDefault,
          headerSize: node.data.headerSize || this. headerOptionDefault,
        });
      }
      // else {
      //   this.fontOptions.setValue({
      //     fontColor: node.data.style["color"] || '#000000',
      //     horizontalAlign: node.data.style["text-align"] || this.hOptionDefault,
      //   });
      // }

    });

    effect(() => {
      const fontSizeControl = this.fontOptions.get('fontSize');
      if (fontSizeControl instanceof FormControl) {
        fontSizeControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(size => {
            console.log('Selected size:', size);
            if (size !== null) {
              this.textStylesSvc.setFontSize(size);
            }
          });
      }

      const fontWeightControl = this.fontOptions.get('fontWeight');
      if (fontWeightControl instanceof FormControl) {
        fontWeightControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(weight => {
            if (weight !== null) {
              this.textStylesSvc.setFontWeight(weight);
            }
          });
      }

      const fontColorControl = this.fontOptions.get('fontColor');
      if (fontColorControl instanceof FormControl) {
        fontColorControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(color => {
            if (color !== null) {
              this.textStylesSvc.setFontColor(color);
            }
          });
      }

      const horizontalAlignControl = this.fontOptions.get('horizontalAlign');
      if (horizontalAlignControl instanceof FormControl) {
        horizontalAlignControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(align => {
            if (align !== null) {
              this.textStylesSvc.setHorizontalAlign(align);
            }
          });
      }

      const headerSizeControl = this.fontOptions.get('headerSize');
      if (headerSizeControl instanceof FormControl) {
        console.log('Selected Header');
        headerSizeControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(size => {
            console.log('Selected header size:', size);
            if (size !== null) {
              this.textStylesSvc.setHeaderSize(size);
            }
          });
      }
    });
  }

  ngOnInit() {
    // this.id = this.selectionSvc.selectedElementId();

    //   this.fontOptions.controls.fontSize.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(size => {
    //     // console.log('Selected size:', size);
    //     if (size !== null)
    //       this.textStylesService.setfontSize(size);
    //   });

    // this.fontOptions.controls.fontWeight.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(weight => {
    //     // console.log('Selected wight:', weight);
    //     if (weight !== null)
    //       this.textStylesService.setfontWeight(weight);
    //   });

    // this.fontOptions.controls.fontColor.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(color => {
    //     console.log('Selected color:', color);
    //     if (color !== null)
    //       this.textStylesService.setfontColor(color);
    //   });

    // this.fontOptions.controls.horizontalAlign.valueChanges
    //   .pipe(distinctUntilChanged())
    //   .subscribe(hAlign => {
    //     // console.log('Selected hAlign:', hAlign);
    //     if (hAlign !== null)
    //       this.textStylesService.setHorizontalAlign(hAlign);
    //   });

  }
}