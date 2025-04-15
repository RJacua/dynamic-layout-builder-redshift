import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-insert-panel',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './insert-panel.component.html',
  styleUrl: './insert-panel.component.scss'
})
export class InsertPanelComponent {

}
