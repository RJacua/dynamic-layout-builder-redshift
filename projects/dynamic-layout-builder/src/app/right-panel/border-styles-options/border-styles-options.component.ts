import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BorderStylesService } from '../../services/borderStyles.service';
import { CornerStylesService } from '../../services/cornerStyles.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-border-styles-options',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './border-styles-options.component.html',
  styleUrl: './border-styles-options.component.scss'
})
export class BorderStylesOptionsComponent implements OnInit {
  private borderStylesService = inject(BorderStylesService)
  
  strokeStyles: string[] = ["Dotted", "Dashed", "Solid", "Double"];
  strokeStyleDefault = 'Solid';

  enableStroke = new FormControl();
  strokeOptions = new FormGroup({
    strokeColor: new FormControl<string>('#000000'),
    strokeStyle: new FormControl<string>(''),
    strokeWidth: new FormControl<number>(1),
  })
 

  constructor() {
    this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleDefault);
  }

  enableStroke$ = this.borderStylesService.enableStroke$;
 
  ngOnInit() {
    
    this.enableStroke.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(stroke => {
        console.log('Add stroke:', stroke);
        if (stroke !== null)
          this.borderStylesService.setAddStroke(stroke);
      });

    this.strokeOptions.controls.strokeColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeColor => {
        console.log('Add strokeColor:', strokeColor);
        if (strokeColor !== null)
          this.borderStylesService.setStrokeColor(strokeColor);
      });

      this.strokeOptions.controls.strokeStyle.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeStyle => {
        console.log('Add strokeStyle:', strokeStyle);
        if (strokeStyle !== null)
          this.borderStylesService.setStrokeStyle(strokeStyle);
      });

      this.strokeOptions.controls.strokeWidth.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeWidth => {
        console.log('Add strokeWidth:', strokeWidth);
        if (strokeWidth !== null)
          this.borderStylesService.setStrokeWidth(strokeWidth);
      });

  }


}
