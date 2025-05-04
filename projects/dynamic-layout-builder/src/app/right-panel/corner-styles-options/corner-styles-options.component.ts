import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CornerStylesService } from '../../services/styles/cornerStyles.service';
import { distinctUntilChanged } from 'rxjs';

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
  private cornerStylesService = inject(CornerStylesService)

  strokeRadius = new FormControl<number>(50)
  enableIndividualCorner = new FormControl()
  cornerOptions = new FormGroup({
    topLeft: new FormControl<number>(0),
    topRight: new FormControl<number>(0),
    bottomLeft: new FormControl<number>(0),
    bottomRight: new FormControl<number>(0),
  })

  enableIndividualCorner$ = this.cornerStylesService.enableIndividualCorner$;

  ngOnInit() {
    this.enableIndividualCorner.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(individualCorner => {
        console.log('Add individualCorner:', individualCorner);
        if (individualCorner !== null)
          this.cornerStylesService.setIndividualCorner(individualCorner);
      });

    this.strokeRadius.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(strokeRadius => {
        console.log('Add strokeRadius:', strokeRadius);
        if (strokeRadius !== null)
          this.cornerStylesService.setStrokeRadius(strokeRadius);
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
