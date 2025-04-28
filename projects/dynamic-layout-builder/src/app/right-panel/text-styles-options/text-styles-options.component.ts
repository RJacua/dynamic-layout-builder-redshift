import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { TextStylesService } from '../../services/textStyles.service';
import { distinctUntilChanged } from 'rxjs';

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

  hOptions: string[] = ["Left", "Center", "Right", "Justify"];
  hOptionDefault = 'Center';

  fontOptions = new FormGroup({
    fontSize: new FormControl<number>(24),
    fontWeight: new FormControl<number>(100),
    fontColor: new FormControl<string>('#000000'),
    horizontalAlign: new FormControl(''),
  })

  constructor() {
    this.fontOptions.controls.horizontalAlign.setValue(this.hOptionDefault);
  }
  
  ngOnInit() {
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
