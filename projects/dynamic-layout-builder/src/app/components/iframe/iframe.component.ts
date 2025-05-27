import { Component, computed, ElementRef, inject, input, Input, signal, viewChild, WritableSignal } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { DragDropService } from '../../services/dragdrop.service';
import { CdkDrag, DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-iframe',
  imports: [
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.scss'
})
export class IframeComponent {
  type = 'iframe';
  @Input() data = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'paragraph', style: {}, enabler: {}, text: 'Lorem ipsum dolor sit amet consectetur...' };
  @Input() editMode: boolean = true;

  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly dragDropSvc = inject(DragDropService)

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

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });
  isHovered = computed(() => {
    return this.id === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  ngOnInit(): void {

    this.id = this.data.id;
    this.parentId.set(this.data.parentId);
    this.text.set(this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...');
    this.target().nativeElement.innerText = this.data.text ?? 'Lorem ipsum dolor sit amet consectetur...';

  }

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
