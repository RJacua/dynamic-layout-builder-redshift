import { Component, computed, Input, Signal, signal } from '@angular/core';
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
  @Input() data: HeaderData = {text: 'Your Title Here', size: 1};

  textContent = signal<string>(this.data.text);
  size = signal<number>(this.data.size);
  
  memoryContent: Signal<HeaderData> = computed(
    () => ({
      text: this.textContent(),
      size: this.size()
    })
  );

  setSize1() {
    this.size.set(1);
    setTimeout(() => console.log("1", this.memoryContent()),1000);
  }
  
  setSize3() {
    this.size.set(3);
    setTimeout(() => console.log("3", this.memoryContent()), 1000);
  }
  
  setSize6() {
    this.size.set(6);
    setTimeout(() => console.log("6", this.memoryContent()), 1000);
  }

}
