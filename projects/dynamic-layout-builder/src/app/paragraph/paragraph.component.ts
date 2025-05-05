import { Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, linkedSignal, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, untracked, viewChild } from '@angular/core';
import { LayoutElement, ParagraphData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';

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

  constructor() {
    effect(() => {
      const text = this.text();

      untracked(() => {
        const nodeModel = this.modelSvc.getNodeById(this.id());
        if (!nodeModel) return;

        const updatedModel = {
          ...nodeModel,
          data: {
            ...nodeModel.data,
            text
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
      }
    
      console.log("on effect style:", this.dynamicStyle());
    });

  }

  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService)

  id = signal('0');
  parentId = signal('-1');
  alignment = signal('align-center ');
  text = signal<string>('');
  size = signal<number>(1);
  menuIsOn = signal(false);
  data2 = input();
  target = viewChild.required<ElementRef<HTMLParagraphElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id()));
  dynamicStyle = signal(this.nodeSignal()?.data.style);

  ngOnInit(): void {
    this.id.set(this.data.id);
    this.parentId.set(this.data.parentId);
    this.text.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');
    this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    this.alignment.set(this.data.style.alignment ?? 'align-center ');
    
    this.dynamicStyle.set(this.data.style ?? {});

    // this.node.set(this.modelSvc.getNodeById(this.id));
  }

  // setAlignment(value: string) {
  //   this.dynamicStyle.update(current => ({
  //     ...current,
  //     'text-align': value
  //   }));
  // }

  isFocused = false;
  isHovered = false;
  
  onFocus() {
    this.isFocused = true;
  }
  
  onBlur() {
    this.isFocused = false;
  }
  
  onMouseEnter() {
    this.isHovered = true;
  }
  
  onMouseLeave() {
    this.isHovered = false;
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

  deleteParagraph() {
    this.modelSvc.removeNodeById(this.id());
  }

  //   nodeModel: Signal<LayoutElement<ParagraphData> | undefined> = computed(
  //     () => this.modelSvc.getNodeById(this.id)
  // );

  // const updatedModel = {
  //   ...currentNode,
  //   data: {
  //     ...currentNode.data,
  //     style: {
  //       ...currentNode.data.style,
  //       [styleType]: value
  //     }
  //   }

  // layoutModelString: Signal<string> = computed(
  //   () => JSON.stringify(this.nodeModel(), null, 2)
  // )

}