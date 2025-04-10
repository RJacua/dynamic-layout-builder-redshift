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
import { NewAreaMenuService } from '../services-yara/new-area-menu.service';
import { MenuComponent } from './new-area-menu/menu.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutElement, SelectionService } from '../services-yara/selection.service';

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
    MatTooltipModule
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  private selectionService = inject(SelectionService)
  initialData: string[] = [];
  constructor(private newAreaMenuSvc: NewAreaMenuService) {
    this.initialData = this.newAreaMenuSvc.rootLevelNodes.slice();
  }

  onElementClick(event:MouseEvent, element: LayoutElement) {
    event.stopPropagation(); 
    this.selectionService.select(element);
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
