import { AfterContentInit, AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, Signal, signal, untracked, viewChild } from '@angular/core';
import { HeaderData, LayoutElement } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';

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
  @Input() data: HeaderData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'header', text: 'Your Title Here', style: { size: 1 }, headerSize: 'h1'};
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();

  constructor() {
    // effect(() => {
    //   const model = this.layoutModel();
    //   untracked(() =>
    //     this.modelSvc.updateModel(this.id(), model)
    //   )
    // });
    effect(() => {
      const text = this.text();
      const headerSize = this.headerSize();

      untracked(() => {
        const nodeModel = this.modelSvc.getNodeById(this.id());
        if (!nodeModel) return;

        const updatedModel = {
          ...nodeModel,
          data: {
            ...nodeModel.data,
            text,
            headerSize
          }
        };

        this.modelSvc.updateModel(this.id(), updatedModel);
        // console.log("on effect: ", this.modelSvc.canvasModel())
      });
    });
    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.canvasModel();

      if (node) {
        this.dynamicStyle.set(node.data.style);
        this.dynamicHeader.set(node.data.headerSize);
      }
    
      console.log("on effect style:", this.dynamicStyle());
      console.log("on effect header:", this.dynamicHeader());
    });
  }
  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  text = signal<string>('');
  // size = signal<number>(1);
  // headerSize = computed(() => 'h' + this.size())
  headerSize = signal('h1');
  id = signal('0');
  parentId = signal('-1')
  data2 = input();
  target = viewChild.required<ElementRef<HTMLHeadElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id()));
  dynamicStyle = signal(this.nodeSignal()?.data.style);
  dynamicHeader = signal(this.nodeSignal()?.data.headerSize);

  isFocused = computed(() => {
    return this.id() === this.selectionSvc.selectedElementId();
  });
  isHovered = false;

  ngOnInit(): void {
    this.text.set(this.data.text ?? 'Your Title Here');
    // this.size.set(this.data.style.size ?? 1);
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.headerSize.set(this.data.headerSize ?? 'h1');
  }
  
  ngAfterViewInit(): void {
    this.target().nativeElement.innerText = this.data.text ?? 'Your Title Here';

  }

  // setSize(size: number) {
  //   this.size.set(size);
  //   console.log("memoryContent", this.layoutModel());
  // }

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

  deleteHeader(){
    this.modelSvc.removeNodeById(this.id());
  }


  // layoutModel: Signal<LayoutElement<HeaderData>> = computed(
  //   () => ({
  //     data: {
  //       id: this.id(),
  //       parentId: this.parentId(),
  //       type: 'header',
  //       text: this.text(),
  //       style: {
  //         size: this.size()
  //       }
  //     }
  //   })
  // );



  // layoutModelString: Signal<string> = computed(
  //   () => JSON.stringify(this.layoutModel(), null, 2)
  // )


}
