import { Component, computed, effect, ElementRef, inject, input, Input, Sanitizer, SecurityContext, signal, untracked, ViewChild, viewChild, WritableSignal } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { DragDropService } from '../../services/dragdrop.service';
import { CdkDrag, DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../services/selection.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { EnablerService } from '../../services/styles/enabler.service';
import { CodeData, LayoutElement } from '../../interfaces/layout-elements';

import Prism from 'prismjs';
(window as any).Prism = Prism;

import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-code',
  imports: [
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss'
})
export class CodeComponent {
  type = 'code';
  @Input() data: CodeData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, codeContent: 'body {\n  background: black;\n  color: white;\n}', language: '', title: '', theme: 'dark' };
  @Input() editMode: boolean = true;

  constructor() {
    effect(() => {
      const codeContent = this.codeContent();

      untracked(() => {
        // const nodeModel = this.nodeSignal();
        if (!this.nodeSignal()) return;

        const updatedModel = {
          ...this.nodeSignal(),
          data: {
            ...this.nodeSignal()?.data,
            codeContent: codeContent
          }
        };

        this.modelSvc.updateModel(this.id, updatedModel as LayoutElement<any>);
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

  }

  @ViewChild('viewCode') viewCode?: ElementRef;
  @ViewChild('coreCode', { static: false }) coreCodeRef?: ElementRef<HTMLElement>;

  @ViewChild('editableCode') editableCode?: ElementRef;
  readonly generalSvc = inject(GeneralFunctionsService);
  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly componentsSvc = inject(ComponentsService);
  readonly dragDropSvc = inject(DragDropService);
  readonly enablerSvc = inject(EnablerService);

  private _elementRef = inject(ElementRef);
  private resizeObserver?: ResizeObserver;

  width = signal(0);
  height = signal(0);

  id = '0';

  parentId = signal('-1');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
  // dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());
  dynamicStyle = signal({});
  internalStyle: WritableSignal<any> = signal(null);
  externalStyle: WritableSignal<any> = signal(null);

  dropIndicatorStyle = computed(() => (!this.isFocused() && this.isHovered()) ? this.dragDropSvc.dropIndicator(this.nodeSignal) : '');

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });
  isHovered = computed(() => {
    return this.id === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  codeContent = signal('');

  isCodeFocused = signal(false);


  language = computed(() => this.nodeSignal().data.language);

  updateCodeContent(event: Event) {
    const value = (event.target as HTMLElement).textContent;
    this.codeContent.set(value!);
  }


  onCodeFocus() {
    this.isCodeFocused.set(true);
  }

  onCodeBlur() {
    setTimeout(() => {
      const el = this.coreCodeRef?.nativeElement;
      if (el) {
        Prism.highlightElement(el);
      }
    }, 0);
  }


  ngAfterViewInit() {
    const el = this.coreCodeRef?.nativeElement;
    if (el) {
      el.innerText = this.codeContent();
      Prism.highlightElement(el); 
    }
  }


  ngOnInit(): void {


    this.id = this.data.id;
    this.parentId.set(this.data.parentId);

    this.nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
    this.codeContent.set(this.data.codeContent ?? 'body {\n  background: black;\n  color: white;\n}');

  }

  onHandleClick() {
    this.isDragging.set(true);
    this.selectionSvc.selectById(this.id, true);
    console.log(this.dragDropSvc.isDragging());
  }

  onClick() {
    this.selectionSvc.selectById(this.id, true);
    // this.selectionSvc.findDeepestElementByDataIdAndTag(this.selectionSvc.selectedElementId(), 'code')
  }

  onMouseUp() {
    console.log(this.dragDropSvc.isDragging())
    this.isDragging.set(false);
  }

  onDragMoved(event: CdkDragMove<any>) {
    this.dragDropSvc.onDragMoved(event);
  }

  processStyle(node: any) {
    this.dynamicStyle.set(node.data.style);
    this.dynamicStyle.update(() => this.enablerSvc.changeStylesByEnablers(this.dynamicStyle(), (node.data.enabler), node.data.type)());

    const { outer, inner } = this.generalSvc.getSplitStyles(this.dynamicStyle());
    this.internalStyle.set(inner);
    this.externalStyle.set(outer);
  }

  // getEmbedUrl(url: string): string {
  //   console.log(url);
  //   url = url.split("&ab_channel")[0];
  //   console.log(url);
  //   if (url.includes("youtu.be")) {
  //     url = url.replace("youtu.be/", "www.youtube.com/watch?v=")
  //     console.log(url);
  //   }
  //   url = url.replace("watch?v=", "embed/");
  //   console.log(url);

  //   return url;
  // }



}
