import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewAreaDialogComponent } from './new-area-dialog/new-area-dialog.component';

@Component({
  selector: 'app-canvas',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  readonly dialog = inject(MatDialog);
  openNewAreaDialog() {
    const dialogRef = this.dialog.open(NewAreaDialogComponent, {
      // data: list,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addNewArea(){
    console.log("add new area");
  }

}
