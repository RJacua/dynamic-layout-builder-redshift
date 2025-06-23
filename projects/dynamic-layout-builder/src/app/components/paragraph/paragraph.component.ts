import { Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, linkedSignal, OnChanges, OnInit, Output, Signal, signal, SimpleChanges, untracked, viewChild, Injector, HostListener, WritableSignal, AfterViewInit } from '@angular/core';
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
import { TextEditorService } from '../../services/text-editor.service';

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

export class ParagraphComponent implements LayoutElement<ParagraphData>, OnInit, AfterViewInit {
  type = 'paragraph';
  @Input() data: ParagraphData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, text: 'Lorem ipsum dolor sit amet consectetur...' };
  @Input() editMode: boolean = true;

  constructor() {
    effect(() => {
      let text = this.text();
      text = text.replaceAll('<button type=\"button\" class=\"link-icon-button\" data-link-icon=\"true\" data-id=\"link-0\" contenteditable=\"false\" tabindex=\"-1\" style=\"user-select: none; pointer-events: auto;\">🔗</button>', '');

      console.log(text)

      untracked(() => {
        if (!this.nodeSignal()) return;

        const updatedModel = {
          ...this.nodeSignal(),
          data: {
            ...this.nodeSignal()?.data,
            text
          }
        };

        this.modelSvc.updateModel(this.id, updatedModel as LayoutElement<any>);

        if (this.editMode && this.selectionSvc.selectedElementId() !== '' && this.selectionSvc.selectedElementId() !== this.nodeSignal().data.id) {
          this.target().nativeElement.innerHTML = this.textEditorSvc.insertLinkIcons(this.nodeSignal().data.text) ?? 'Lorem ipsum dolor sit amet consectetur...';
          this.textEditorSvc.attachLinkHandlers(this.target().nativeElement, this.nodeSignal().data.id);
        }
      });
    });
    effect(() => {

      const element = this._elementRef.nativeElement.querySelector('#core');

      if (element) {
        this.resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const rect = entry.contentRect;
            this.width.set(rect.width);
            this.height.set(rect.height);
          }
        });

        this.resizeObserver.observe(element);
      }


      const node = this.nodeSignal();
      // const canvasModel = this.modelSvc.canvasModel();
      // const canvasModel = this.modelSvc.hasCanvasModelChanged();

      untracked(() => {
        if (node) {
          // this.processContainerStyle(node);
          this.componentsSvc.processComponentStyle(this.nodeSignal(), this.dynamicStyle, this.internalStyle, this.externalStyle, this.width(), this.height());
        }
      })

      // console.log("on effect style:", this.dynamicStyle());
    });

    effect(() => {

      let currentId = this.selectionSvc.selectedElementId();
      untracked(() => {
        if (this.editMode && this.selectionSvc.selectedElementId() !== '' && this.selectionSvc.selectedElementId() !== this.nodeSignal().data.id) {
          this.target().nativeElement.innerHTML = this.textEditorSvc.insertLinkIcons(this.nodeSignal().data.text) ?? 'Lorem ipsum dolor sit amet consectetur...';
          this.textEditorSvc.attachLinkHandlers(this.target().nativeElement, this.nodeSignal().data.id);
        }
      })

    })

  }

  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  // readonly borderStylesSvc = inject(BorderStylesService);
  readonly enablerSvc = inject(EnablerService);
  readonly dragDropSvc = inject(DragDropService);
  readonly generalSvc = inject(GeneralFunctionsService);
  readonly textEditorSvc = inject(TextEditorService);

  private _elementRef = inject(ElementRef);

  id = '0';
  parentId = signal('-1');
  alignment = signal('align-center ');
  text = signal<string>('');
  processedText = signal<string>('');
  size = signal<number>(1);
  target = viewChild.required<ElementRef<HTMLParagraphElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
  // dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
  dynamicStyle = signal({});
  internalStyle: WritableSignal<any> = signal(null);
  externalStyle: WritableSignal<any> = signal(null);

  // width = signal(this._elementRef.nativeElement.getBoundingClientRect.width);
  // height = signal(this._elementRef.nativeElement.getBoundingClientRect.height);
  width = signal(0);
  height = signal(0);

  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {


    this.processedText.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');

    this.text.set(this.processedText());

    this.id = this.data.id;
    this.parentId.set(this.data.parentId);

    this.nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));

    // this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    // this.alignment.set(this.data.style.alignment ?? 'align-center ');

    // this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)() ?? {});

  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    this.width.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().width);
    this.height.set(this._elementRef.nativeElement.querySelector('#core').getBoundingClientRect().height);

    this.componentsSvc.processComponentStyle(this.nodeSignal(), this.dynamicStyle, this.internalStyle, this.externalStyle, this.width(), this.height());

    if (this.editMode) {
      this.target().nativeElement.innerHTML = this.textEditorSvc.insertLinkIcons(this.nodeSignal().data.text) ?? 'Lorem ipsum dolor sit amet consectetur...';
      this.textEditorSvc.attachLinkHandlers(this.target().nativeElement, this.nodeSignal().data.id);
    }
    else {
      this.target().nativeElement.innerHTML = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';
    }

  }

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });
  isHovered = computed(() => {
    return this.id === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  updateTextContent(event: Event) {
    const value = (event.target as HTMLElement).innerHTML;
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

  onMouseUp() {
    this.isDragging.set(false);
  }

  onDragMoved(event: CdkDragMove<any>) {
    this.dragDropSvc.onDragMoved(event);
  }

  dropIndicatorStyle = computed(() => (!this.isFocused() && this.isHovered()) ? this.dragDropSvc.dropIndicator(this.nodeSignal) : '');


}