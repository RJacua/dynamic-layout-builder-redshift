import { Component } from '@angular/core';

@Component({
  selector: 'app-iframe',
  imports: [],
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.scss'
})
export class IframeComponent {

  @Input() data: ParagraphData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, text: 'Lorem ipsum dolor sit amet consectetur...' };

}
