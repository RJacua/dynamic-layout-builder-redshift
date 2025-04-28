import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { distinctUntilChanged } from 'rxjs';
import { BackgroundStylesService } from '../../services/backgroundStyles.service';

@Component({
  selector: 'app-background-styles-options',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatListModule, 
    MatDividerModule, 
    ReactiveFormsModule],
  templateUrl: './background-styles-options.component.html',
  styleUrl: './background-styles-options.component.scss'
})
export class BackgroundStylesOptionsComponent implements OnInit {
  private bgStylesService = inject(BackgroundStylesService)

  bgColor = new FormControl<string>('#ffffff');
  bgOpacity = new FormControl<number>(100);

  

  ngOnInit() {
    this.bgColor.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(color => {
        console.log('Selected bg color:', color);
        if (color)
          this.bgStylesService.setBgColor(color);
      });

    this.bgOpacity.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(opacity => {
        console.log('Selected bg opacity:', opacity);
        if (opacity)
          this.bgStylesService.setBgOpacity(opacity);
      });

  }

}
