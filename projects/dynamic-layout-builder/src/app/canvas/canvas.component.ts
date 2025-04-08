import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {

  openNewAreaDialog() {
    console.log("open new area dialog");
  }

  addNewArea(){
    console.log("add new area");
  }

}
