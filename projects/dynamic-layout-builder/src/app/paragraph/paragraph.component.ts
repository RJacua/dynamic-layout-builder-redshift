import { Component, computed, effect, ElementRef, EventEmitter, inject, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { LayoutElement, LayoutModel, ParagraphData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss'
})


export class ParagraphComponent implements LayoutElement<ParagraphData>, OnInit {
  type = 'paragraph';
  @Input() data: ParagraphData = { id: crypto.randomUUID().split("-")[0], type: 'paragraph', text: 'Lorem ipsum dolor sit amet consectetur...' };
  @Output() modelChange = new EventEmitter<LayoutModel<any>>();

  componentsSvc = inject(ComponentsService);
    readonly modelSvc = inject(ModelService);
  id = signal('0');
  alignment = signal('align-center ');
  text = signal<string>('');
  size = signal<number>(1);

  menuIsOn = signal(false);

  constructor() {
    effect(() => {
      this.componentsSvc.emitModel(this.layoutModel, this.modelChange);
    })
  }

  ngOnInit(): void {
    this.id.set(this.data.id);
    this.text.set(this.data.text || '');
    this.alignment.set(this.data.style?.alignment || 'align-center ');
    this.size.set(this.data.style?.size || 1);

    // console.log(`componente do tipo ${this.type} e id ${this.id()} criado`)
  }

  //Lógica do Menu, passar para um serviço depois
  setAlignment(value: string) {
    this.alignment.set(`paragraph-align-${value} `);
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


  layoutModel: Signal<LayoutModel<ParagraphData>> = computed(
    () => ({
      data: {
        id: this.id(),
        type: 'paragraph',
        text: this.text(),
        style: {
          size: this.size(),
          alignment: this.alignment()
        }
      }
    })
  );

  layoutModelString: Signal<string> = computed(
    () => JSON.stringify(this.layoutModel(), null, 2)
  )

}

