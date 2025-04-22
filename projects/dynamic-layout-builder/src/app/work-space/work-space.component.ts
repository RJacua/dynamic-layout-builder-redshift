import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CanvasComponent } from "../canvas/canvas.component";
import { RightPanelComponent } from "../right-panel/right-panel.component";
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-work-space',
  imports: [MatSidenavModule, CanvasComponent, RightPanelComponent, LeftPanelComponent, AngularSplitModule],
  templateUrl: './work-space.component.html',
  styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent {

}
