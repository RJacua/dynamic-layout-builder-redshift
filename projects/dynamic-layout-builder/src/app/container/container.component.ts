import { Component, ElementRef, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ParagraphComponent } from "../paragraph/paragraph.component";
import { ComponentsService } from '../services/components.service';

@Component({
  selector: 'app-area',
  imports: [HeaderComponent, ParagraphComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class AreaComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  htmlContent: string = '[{ "type": "paragraph", "content": "Olá mundo" }]';

  readonly componentsSvc = inject(ComponentsService);
  constructor(private host: ElementRef) { }

  addArea() {
    this.componentsSvc.addComponent('area', this.container);
  }

  addParagraph() {
    this.componentsSvc.addComponent('paragraph', this.container);
  }

  addHeader() {
    this.componentsSvc.addComponent('header', this.container);
  }

}