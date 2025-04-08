import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// npm install @angular/material@latest

@Component({
  selector: 'app-new-area-dialog',
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions],
  templateUrl: './new-area-dialog.component.html',
  styleUrl: './new-area-dialog.component.scss'
})
export class NewAreaDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NewAreaDialogComponent>);

  closeListDialog(): void {
    this.dialogRef.close();
  }
}
