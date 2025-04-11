import { Component, computed, Input, Signal, signal } from '@angular/core';
import { LayoutElement, HeaderData } from '../interfaces/layout-elements';
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

export class HeaderComponent implements LayoutElement<HeaderData>{
  type = 'header';
  @Input() data: HeaderData = {text: 'Your Title Here', size: 1};

  text = signal<string>(this.data.text);
  size = signal<number>(this.data.size);
  
  memoryContent: Signal<HeaderData> = computed(
    () => ({
      text: this.text(),
      size: this.size()
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

}
