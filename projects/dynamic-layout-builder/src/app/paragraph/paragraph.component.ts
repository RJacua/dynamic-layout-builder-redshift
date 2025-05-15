import { Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, linkedSignal, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, untracked, viewChild, Injector, HostListener } from '@angular/core';
import { LayoutElement, ParagraphData } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';
import { BorderStylesService } from '../services/styles/borderStyles.service';
import { CdkDrag, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { DragdropService } from '../services/dragdrop.service';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss'
})

export class ParagraphComponent implements LayoutElement<ParagraphData>, OnInit {
  type = 'paragraph';
  @Input() data: ParagraphData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, text: 'Lorem ipsum dolor sit amet consectetur...' };

  constructor() {
    effect(() => {
      const text = this.text();

      untracked(() => {
        // const nodeModel = this.nodeSignal();
        if (!this.nodeSignal()) return;

        const updatedModel = {
          ...this.nodeSignal(),
          data: {
            ...this.nodeSignal()?.data,
            text
          }
        };

        this.modelSvc.updateModel(this.id, updatedModel as LayoutElement<any>);
      });
    });
    effect(() => {
      const node = this.nodeSignal();
      // const canvasModel = this.modelSvc.canvasModel();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();
      if (node) {
        this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
      }

      // console.log("on effect style:", this.dynamicStyle());
    });

  }

  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly borderStylesSvc = inject(BorderStylesService);
    readonly dragDropSvc = inject(DragdropService);

  id = '0';
  parentId = signal('-1');
  alignment = signal('align-center ');
  text = signal<string>('');
  size = signal<number>(1);
  menuIsOn = signal(false);
  data2 = input();
  target = viewChild.required<ElementRef<HTMLParagraphElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
  dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
  ngOnInit(): void {
    this.id = this.data.id;
    this.parentId.set(this.data.parentId);
    this.text.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');
    this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    // this.alignment.set(this.data.style.alignment ?? 'align-center ');

    this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)() ?? {});

  }

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });
  isHovered = computed(() => {
    return this.id === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  updateTextContent(event: Event) {
    const value = (event.target as HTMLElement).innerText;
    this.text.set(value);
  }

  deleteParagraph() {
    this.modelSvc.removeNodeById(this.id);
  }

  @Output() editingChanged = new EventEmitter<boolean>();

  onHandleClick(){
    this.isDragging.set(true);
    // console.log("handle click: ",this.selectionSvc.isDragging());
    this.selectionSvc.selectById(this.id, true);
  }

}