import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { TextStylesService } from '../../services/styles/textStyles.service';
import { distinctUntilChanged } from 'rxjs';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { Styles } from '../../interfaces/layout-elements';
import { GeneralFunctionsService } from '../../services/generalFunctions.service';

@Component({
  selector: 'app-text-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './text-styles-options.component.html',
  styleUrl: './text-styles-options.component.scss'
})
export class TextStylesOptionsComponent {
  readonly textStylesSvc = inject(TextStylesService)
  readonly selectionSvc = inject(SelectionService)
  readonly generalSvc = inject(GeneralFunctionsService)


  // id = '0';
  // node = signal(this.modelSvc.getNodeById(this.id));
  // dynamicStyle = signal(this.node()?.data.style);
  selectedNode = this.selectionSvc.selectedNode;

  hOptions = this.textStylesSvc.hOptions;
  hOptionDefault = this.textStylesSvc.hOptionDefault;

  headerOptions = this.textStylesSvc.headerOptions;
  headerOptionDefault = this.textStylesSvc.headerOptionDefault;
  
  headerStyles = this.textStylesSvc.defaultHeaderStyles;
  paragraphStyles = this.textStylesSvc.defaultParagraphStyles;

  // paragraphStyles: Styles = {
  //   ['font-size']: '16px',
  //   ['font-weight']: '400',
  //   color: '#000000',
  //   ['text-align']: this.hOptionDefault,
  // };
  // headerStyles: Styles = {
  //   color: '#000000',
  //   ['text-align']: this.hOptionDefault,
  //   // headerSize: this.headerOptionDefault,
  // };

  fontOptions = new FormGroup({
    // fontSize: new FormControl<number>(0),
    // fontWeight: new FormControl<number>(0),
    // fontColor: new FormControl<string>(''),
    // horizontalAlign: new FormControl<string>(''),
  });

  constructor() {
    // this.fontOptions.controls.horizontalAlign.setValue(this.hOptionDefault);

    effect(() => {
      let defaultStyles: Styles;
      const node = this.selectedNode();
      if (!node) return;

      if (this.selectedNode()?.data.type === 'header') {
        defaultStyles = this.headerStyles;
      }
      else {
        defaultStyles = this.paragraphStyles;
      }
      // if (Object.keys(node.data.style).length < 3) {
      untracked(() => {
        this.textStylesSvc.setAllMissing(defaultStyles, node.data.style);
      })

      // }

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
          fontColor: node.data.style["color"] || this.paragraphStyles.color,
          horizontalAlign: node.data.style["text-align"] || this.paragraphStyles['text-align'],
          fontSize: parseInt(node.data.style["font-size"]) ||  this.paragraphStyles['font-size'],
          fontWeight: parseInt(node.data.style["font-weight"]) || this.paragraphStyles['font-weight'],
        });

      }
      else if (this.selectedNode()?.data.type === 'header') {
        this.fontOptions.setValue({
          fontColor: node.data.style["color"] || this.headerStyles.color,
          horizontalAlign: node.data.style["text-align"] || this.headerStyles['text-align'],
          headerSize: node.data.headerSize || this.headerOptionDefault,
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
            // console.log('Selected size:', size);
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
        headerSizeControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(size => {
            // console.log('Selected header size:', size);
            if (size !== null) {
              this.textStylesSvc.setHeaderSize(size);
            }
          });
      }
    });
  }

}