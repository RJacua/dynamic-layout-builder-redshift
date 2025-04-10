import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { NewAreaDialogComponent } from './new-area-dialog/new-area-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { NewAreaMenuService } from './new-area-menu.service';
import { MenuComponent } from './new-area-menu/menu.component';

@Component({
  selector: 'app-canvas',
  imports: [
    CommonModule,
    MatFormFieldModule,
    // MatInputModule,
    // FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MenuComponent,
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  initialData: string[] = [];
  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }




  // readonly dialog = inject(MatDialog);
  // openNewAreaDialog() {
  // const dialogRef = 
  // this.dialog.open(NewAreaDialogComponent, {
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   console.log('The dialog was closed');
  // });
  // }

  addNewArea() {
    console.log("add new area");
  }

}
