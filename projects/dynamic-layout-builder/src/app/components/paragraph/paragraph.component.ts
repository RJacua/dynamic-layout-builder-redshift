import { Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, linkedSignal, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, untracked, viewChild, Injector, HostListener, WritableSignal } from '@angular/core';
import { LayoutElement, ParagraphData } from '../../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../../services/components.service';
import { ModelService } from '../../services/model.service';
import { SelectionService } from '../../services/selection.service';
import { BorderStylesService } from '../../services/styles/border-styles.service';
import { CdkDrag, CdkDragEnter, CdkDragMove, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropService } from '../../services/dragdrop.service';
import { EnablerService } from '../../services/styles/enabler.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';

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
  @Input() editMode: boolean = true;

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
      const canvasChanged = this.modelSvc.hasCanvasModelChanged();

      untracked(() => {
        if (node) {
          this.processStyle(node);
        }
      })

      // console.log("on effect style:", this.dynamicStyle());
    });

  }

  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  // readonly borderStylesSvc = inject(BorderStylesService);
  readonly enablerSvc = inject(EnablerService);
  readonly dragDropSvc = inject(DragDropService);
  readonly generalSvc = inject(GeneralFunctionsService);

  id = '0';
  parentId = signal('-1');
  alignment = signal('align-center ');
  text = signal<string>('');
  size = signal<number>(1);
  target = viewChild.required<ElementRef<HTMLParagraphElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
  // dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
  dynamicStyle = signal({});
  internalStyle: WritableSignal<any> = signal(null);
  externalStyle: WritableSignal<any> = signal(null);
  
  ngOnInit(): void {
    this.id = this.data.id;
    this.parentId.set(this.data.parentId);
    this.text.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');
    this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    // this.alignment.set(this.data.style.alignment ?? 'align-center ');

    // this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)() ?? {});

  }

  processStyle(node: any) {
    this.dynamicStyle.set(node.data.style);
    this.dynamicStyle.update(() => this.enablerSvc.changeStylesByEnablers(this.dynamicStyle(), (node.data.enabler), node.data.type)());
  
    const { outer, inner } = this.generalSvc.getSplitStyles(this.dynamicStyle());
    this.internalStyle.set(inner);
    this.externalStyle.set(outer);
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

  // @Output() editingChanged = new EventEmitter<boolean>();

  onHandleClick() {
    this.isDragging.set(true);
    // console.log("handle click: ",this.selectionSvc.isDragging());
    this.selectionSvc.selectById(this.id, true);
  }

  onDragMoved(event: CdkDragMove<any>) {
    this.dragDropSvc.onDragMoved(event);
  }

  dropIndicatorStyle = computed(() => (!this.isFocused() && this.isHovered()) ? this.dragDropSvc.dropIndicator(this.nodeSignal) : '');

}