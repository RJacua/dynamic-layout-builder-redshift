import { Component, Input, signal } from '@angular/core';
import { LayoutElement, ParagraphData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss'
})


export class ParagraphComponent implements LayoutElement<ParagraphData> {
  type = 'paragraph';
  @Input() data: ParagraphData = { text: 'Lorem ipsum dolor sit amet consectetur...' };

  alignment = signal('align-center ');
  menuIsOn = signal(false);

  setAlignment(value: string) {
    this.alignment.set(`align-${value} `);

  }

  hideMenu(event: Event) {
    const related = (event as FocusEvent).relatedTarget as HTMLElement | null;

    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      this.menuIsOn.set(false);
    }
    
  }

  showMenu(event: Event) {
    this.menuIsOn.set(true);
  }

}

