import { Component, computed, effect, ElementRef, inject, input, Input, Sanitizer, SecurityContext, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { DragDropService } from '../../services/dragdrop.service';
import { CdkDrag, DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../services/selection.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { EnablerService } from '../../services/styles/enabler.service';
import { ImageData } from '../../interfaces/layout-elements';
import { sanitizeUrl } from "@braintree/sanitize-url"

@Component({
  selector: 'app-image',
  imports: [
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  type = 'image';
  @Input() data: ImageData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, url: '', tooltip: 'this is an image', alt: 'Image' };
  @Input() editMode: boolean = true;

  constructor() {
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

  readonly generalSvc = inject(GeneralFunctionsService);
  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly dragDropSvc = inject(DragDropService);
  readonly enablerSvc = inject(EnablerService);

  id = '0';

  src = computed(() => {
    let url
    try {
      url = new URL(this.nodeSignal().data.src);
      // let sanatizedUrl = sanitizeUrl(url.toString());
      // return this._sanitizer.bypassSecurityTrustResourceUrl(sanatizedUrl);
      return url;
    }
    catch (error) {

    }
    return '';
  });
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

  alt = computed(() => this.nodeSignal().data.alt);

  ngAfterViewInit() {

  }

  ngOnInit(): void {

    this.id = this.data.id;
    this.parentId.set(this.data.parentId);

  }

  onHandleClick() {
    this.isDragging.set(true);
    this.selectionSvc.selectById(this.id, true);
    console.log(this.dragDropSvc.isDragging());
  }

  onClick() {
    this.selectionSvc.selectById(this.id, true);
    // this.selectionSvc.findDeepestElementByDataIdAndTag(this.selectionSvc.selectedElementId(), 'image')
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
