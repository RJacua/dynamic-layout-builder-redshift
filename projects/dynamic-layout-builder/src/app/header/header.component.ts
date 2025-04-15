import { AfterContentInit, Component, computed, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { LayoutElement, HeaderData, LayoutModel } from '../interfaces/layout-elements';
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

export class HeaderComponent implements LayoutElement<HeaderData>, OnInit {
  type = 'header';
  @Input() data: HeaderData = { id: crypto.randomUUID().split("-")[0], type: 'header', text: 'Your Title Here', style: { size: 1 } };
  @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  text = signal<string>('');
  size = signal<number>(1);
  id = signal('0');

  ngOnInit(): void {
    this.text.set(this.data.text || '');
    this.size.set(this.data.style?.size || 1);
    this.id.set(this.data.id);

    console.log(`componente do tipo ${this.type} e id ${this.id()} criado`)
  }
  
  setSize(size: number) {
    this.size.set(size);
    console.log("memoryContent", this.layoutModel());
  }

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

  
  layoutModel: Signal<LayoutModel<HeaderData>> = computed(
    () => ({
      data: {
        id: this.id(),
        type: 'header',
        text: this.text(),
        style: {
          size: this.size()
        }
      }
    })
  );

  
  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel(), null, 2)
  )

  emitModel() {
    this.modelChange.emit({
      data: this.layoutModel(),
    });
  }

}
