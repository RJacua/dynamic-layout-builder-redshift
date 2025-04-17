import { AfterContentInit, AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, Signal, signal, untracked, viewChild } from '@angular/core';
import { HeaderData, LayoutElement } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements LayoutElement<HeaderData>, OnInit, AfterViewInit {
  type = 'header';
  @Input() data: HeaderData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'header', text: 'Your Title Here', style: { size: 1 } };
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();
  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  text = signal<string>('');
  size = signal<number>(1);
  headerSize = computed(() => 'h' + this.size())
  id = signal('0');
  parentId = signal('-1')
  data2 = input();
  target = viewChild.required<ElementRef<HTMLHeadElement>>('target');

  constructor() {
    effect(() => {
      const model = this.layoutModel();
      untracked(() =>
        this.modelSvc.updateModel(this.id(), model)
      )
    })
  }

  ngOnInit(): void {
    this.text.set(this.data.text || '');
    this.size.set(this.data.style?.size || 1);
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
  }
  
  ngAfterViewInit(): void {
    this.target().nativeElement.innerText = this.data.text || '';

  }

  setSize(size: number) {
    this.size.set(size);
    console.log("memoryContent", this.layoutModel());
  }

  textSyncOnBlur(event: Event) {
    const element = event.target as HTMLElement;
    const value = (event.target as HTMLElement).innerText;
    this.text.set(value);
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


  layoutModel: Signal<LayoutElement<HeaderData>> = computed(
    () => ({
      data: {
        id: this.id(),
        parentId: this.parentId(),
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


}
