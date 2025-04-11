import { Component, computed, Input, Signal, signal } from '@angular/core';
import { LayoutElement, HeaderData, MemoryContent } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements LayoutElement<HeaderData> {
  type = 'header';
  @Input() data: HeaderData = { type: 'header', text: 'Your Title Here', style: { size: 1 } };

  text = signal<string>(this.data.text);
  size = signal<number>(this.data.style?.size || 1);

  memoryContent: Signal<MemoryContent<HeaderData>> = computed(
    () => ({
      data: {
        type: 'header',
        text: this.text(),
        style: {
          size: this.size()
        }
      }
    })
  );

  setSize(size: number) {
    this.size.set(size);
    console.log("memoryContent", this.memoryContent());
  }

  // Evita reatribuição visual constante
  textSyncOnBlur(event: Event) {
    const element = event.target as HTMLElement;
    const value = (event.target as HTMLElement).innerText;
    if (value !== this.text()) {
      this.text.set(value);
    }
    if (element.innerText !== this.text()) {
      element.innerText = this.text();
    }
  }

  //Lógica do Menu, passar para um serviço depois
  menuIsOn = signal(false);

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
