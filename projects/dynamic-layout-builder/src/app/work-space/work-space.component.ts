import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CanvasComponent } from "../canvas/canvas.component";
import { SidePanelComponent } from "../side-panel/side-panel.component";

@Component({
  selector: 'app-work-space',
  imports: [MatSidenavModule, CanvasComponent, SidePanelComponent],
  templateUrl: './work-space.component.html',
  styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent {

}
