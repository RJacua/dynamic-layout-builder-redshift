import { Component, Input } from '@angular/core';
import { LayoutElement, ParagraphData } from '../interfaces/layout-elements';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss'
})


export class ParagraphComponent implements LayoutElement<ParagraphData> {
  type = 'paragraph';
  @Input() data: ParagraphData = {text: 'Lorem ipsum dolor sit amet consectetur...'};
}

