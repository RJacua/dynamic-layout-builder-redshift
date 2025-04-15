import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BorderStylesService } from '../../services-yara/borderStyles.service';
import { CornerStylesService } from '../../services-yara/cornerStyles.service';
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
  private cornerStylesService = inject(CornerStylesService)

  strokeStyles: string[] = ["Dotted", "Dashed", "Solid", "Double"];
  strokeStyleDefault = 'Solid';

  enableStroke = new FormControl();
  strokeOptions = new FormGroup({
    strokeColor: new FormControl<string>('#000000'),
    strokeRadius: new FormControl<number>(0),
    strokeStyle: new FormControl<string>(''),
    strokeWidth: new FormControl<number>(1),
    enableIndividualCorner: new FormControl()
  })

  cornerOptions = new FormGroup({
    topLeft: new FormControl<number>(0),
    topRight: new FormControl<number>(0),
    bottomLeft: new FormControl<number>(0),
    bottomRight: new FormControl<number>(0),
  })

  constructor() {
    this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleDefault);
  }

  addStrokeValue$ = this.borderStylesService.enableStroke$;
  individualCorner$ = this.cornerStylesService.enableIndividualCorner$;

  ngOnInit() {
    
    this.enableStroke.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(stroke => {
        console.log('Add stroke:', stroke);
        if (stroke !== null)
          this.borderStylesService.setAddStroke(stroke);
      });

      this.strokeOptions.controls.enableIndividualCorner.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(individualCorner => {
        console.log('Add individualCorner:', individualCorner);
        if (individualCorner !== null)
          this.cornerStylesService.setIndividualCorner(individualCorner);
      });

    this.strokeOptions.controls.strokeColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeColor => {
        console.log('Add strokeColor:', strokeColor);
        if (strokeColor !== null)
          this.borderStylesService.setStrokeColor(strokeColor);
      });

      this.strokeOptions.controls.strokeRadius.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeRadius => {
        console.log('Add strokeRadius:', strokeRadius);
        if (strokeRadius !== null)
          this.borderStylesService.setStrokeRadius(strokeRadius);
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

      this.cornerOptions.controls.topLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topLeft => {
        console.log('Add topLeft:', topLeft);
        if (topLeft !== null)
          this.cornerStylesService.setTopLeft(topLeft);
      });
      
      this.cornerOptions.controls.topRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topRight => {
        console.log('Add topRight:', topRight);
        if (topRight !== null)
          this.cornerStylesService.setTopRight(topRight);
      });
     
      this.cornerOptions.controls.bottomLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomLeft => {
        console.log('Add bottomLeft:', bottomLeft);
        if (bottomLeft !== null)
          this.cornerStylesService.setBottomLeft(bottomLeft);
      });
     
      this.cornerOptions.controls.bottomRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomRight => {
        console.log('Add bottomRight:', bottomRight);
        if (bottomRight !== null)
          this.cornerStylesService.setBottomRight(bottomRight);
      });

  }


}
