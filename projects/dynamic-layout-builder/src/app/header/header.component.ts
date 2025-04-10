import { Component, Input } from '@angular/core';
import { LayoutElement, HeaderData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements LayoutElement<HeaderData>{

  type = 'header';
  @Input() data: HeaderData = {
    text: 'Your Title Her',
    size: 'h1',
  };

}
