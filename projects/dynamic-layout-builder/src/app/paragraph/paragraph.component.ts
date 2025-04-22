import { Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, linkedSignal, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, untracked, viewChild } from '@angular/core';
import { LayoutElement, ParagraphData } from '../interfaces/layout-elements';
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
  @Input() data: ParagraphData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, text: 'Lorem ipsum dolor sit amet consectetur...' };
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();

  componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  id = signal('0');
  parentId = signal('-1');
  alignment = signal('align-center ');
  text = signal<string>('');
  size = signal<number>(1);
  menuIsOn = signal(false);
  data2 = input();
  target = viewChild.required<ElementRef<HTMLParagraphElement>>('target');

  constructor() {
    effect(() => {
      const model = this.layoutModel();
      untracked(() =>
        this.modelSvc.updateModel(this.id(), model)
      )
    })
  }


  ngOnInit(): void {
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.text.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');
    this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    this.alignment.set(this.data.style.alignment ?? 'align-center ');
    this.size.set(this.data.style?.size || 1);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const data = changes['data'];
  //   debugger
  //   if (data) {
  //     this.text.set(this.data.text || '');
  //     this.target().nativeElement.innerText = data.currentValue.text;
  //   }
  // }
  
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

  updateTextContent(event: Event) {
    const value = (event.target as HTMLElement).innerText;

    this.text.set(value);
  }


  layoutModel: Signal<LayoutElement<ParagraphData>> = computed(
    () => ({
      data: {
        id: this.id(),
        parentId: this.parentId(),
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

