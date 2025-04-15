import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { distinctUntilChanged } from 'rxjs';
import { StylesService } from '../../services-yara/styles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-options',
  imports: [CommonModule, MatCardModule, MatListModule, MatDividerModule, ReactiveFormsModule],
  templateUrl: './general-options.component.html',
  styleUrl: './general-options.component.scss'
})
export class GeneralOptionsComponent implements OnInit {
  private stylesService = inject(StylesService)
  hOptions: string[] = ["Left", "Center", "Right", "Justify"];
  hOptionDefault = 'Center';

  strokeStyles: string[] = ["Dotted", "Dashed", "Solid", "Double"];
  strokeStyleDefault = 'Solid';


  // Form Controls
  bgColor = new FormControl<string>('#ffffff');
  bgOpacity = new FormControl<number>(100);

  fontOptions = new FormGroup({
    fontSize: new FormControl<number>(24),
    fontWeight: new FormControl<number>(100),
    fontColor: new FormControl<string>('#000000'),
    horizontalAlign: new FormControl(''),
  })

  addStroke = new FormControl();
  strokeOptions = new FormGroup({
    strokeColor: new FormControl<string>('#000000'),
    strokeRadius: new FormControl<number>(0),
    strokeStyle: new FormControl<string>(''),
    strokeWidth: new FormControl<number>(1),
    individualCorner: new FormControl()
  })

  cornerOptions = new FormGroup({
    topLeft: new FormControl<number>(0),
    topRight: new FormControl<number>(0),
    bottomLeft: new FormControl<number>(0),
    bottomRight: new FormControl<number>(0),
  })



  constructor() {
    this.fontOptions.controls.horizontalAlign.setValue(this.hOptionDefault);
    this.strokeOptions.controls.strokeStyle.setValue(this.strokeStyleDefault);
  }

  addStrokeValue$ = this.stylesService.addStroke$;
  individualCorner$ = this.stylesService.individualCorner$;



  ngOnInit() {
    this.bgColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(color => {
        console.log('Selected bg color:', color);
        if (color)
          this.stylesService.setBgColor(color);
      });

    this.bgOpacity.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(opacity => {
        console.log('Selected bg opacity:', opacity);
        if (opacity)
          this.stylesService.setBgOpacity(opacity);
      });

    this.fontOptions.controls.fontSize.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(size => {
        console.log('Selected size:', size);
        if (size !== null)
          this.stylesService.setfontSize(size);
      });

    this.fontOptions.controls.fontWeight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(weight => {
        console.log('Selected wight:', weight);
        if (weight !== null)
          this.stylesService.setfontWeight(weight);
      });

    this.fontOptions.controls.fontColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(color => {
        console.log('Selected color:', color);
        if (color !== null)
          this.stylesService.setfontColor(color);
      });

    this.fontOptions.controls.horizontalAlign.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(hAlign => {
        console.log('Selected hAlign:', hAlign);
        if (hAlign !== null)
          this.stylesService.setHorizontalAlign(hAlign);
      });

    this.addStroke.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(stroke => {
        console.log('Add stroke:', stroke);
        if (stroke !== null)
          this.stylesService.setAddStroke(stroke);
      });

      this.strokeOptions.controls.individualCorner.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(individualCorner => {
        console.log('Add individualCorner:', individualCorner);
        if (individualCorner !== null)
          this.stylesService.setIndividualCorner(individualCorner);
      });

    this.strokeOptions.controls.strokeColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeColor => {
        console.log('Add strokeColor:', strokeColor);
        if (strokeColor !== null)
          this.stylesService.setStrokeColor(strokeColor);
      });

      this.strokeOptions.controls.strokeRadius.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeRadius => {
        console.log('Add strokeRadius:', strokeRadius);
        if (strokeRadius !== null)
          this.stylesService.setStrokeRadius(strokeRadius);
      });

      this.strokeOptions.controls.strokeStyle.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeStyle => {
        console.log('Add strokeStyle:', strokeStyle);
        if (strokeStyle !== null)
          this.stylesService.setStrokeStyle(strokeStyle);
      });

      this.strokeOptions.controls.strokeWidth.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeWidth => {
        console.log('Add strokeWidth:', strokeWidth);
        if (strokeWidth !== null)
          this.stylesService.setStrokeWidth(strokeWidth);
      });

      this.cornerOptions.controls.topLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topLeft => {
        console.log('Add topLeft:', topLeft);
        if (topLeft !== null)
          this.stylesService.setTopLeft(topLeft);
      });
      
      this.cornerOptions.controls.topRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(topRight => {
        console.log('Add topRight:', topRight);
        if (topRight !== null)
          this.stylesService.setTopRight(topRight);
      });
     
      this.cornerOptions.controls.bottomLeft.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomLeft => {
        console.log('Add bottomLeft:', bottomLeft);
        if (bottomLeft !== null)
          this.stylesService.setBottomLeft(bottomLeft);
      });
     
      this.cornerOptions.controls.bottomRight.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(bottomRight => {
        console.log('Add bottomRight:', bottomRight);
        if (bottomRight !== null)
          this.stylesService.setBottomRight(bottomRight);
      });

  }

}
