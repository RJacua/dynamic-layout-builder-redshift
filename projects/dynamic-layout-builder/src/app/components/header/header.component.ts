import { AfterContentInit, AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, Signal, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { AtomicElementData, ContainerData, HeaderData, LayoutElement } from '../../interfaces/layout-elements';
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
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements LayoutElement<HeaderData>, OnInit, AfterViewInit {
  type = 'header';
  @Input() data: HeaderData = { id: crypto.randomUUID().split("-")[0], parentId: '-1', type: 'header', text: 'Your Title Here', style: {}, enabler: {}, headerSize: 'h1' };
  @Input() editMode: boolean = true;
  // @Output() modelChange = new EventEmitter<LayoutModel<any>>();

  constructor() {
    // effect(() => {
    //   const model = this.layoutModel();
    //   untracked(() =>
    //     this.modelSvc.updateModel(this.id, model)
    //   )
    // });
    effect(() => {
      const node = this.nodeSignal();
      const text = this.text();
      const headerSize = this.headerSize();

      untracked(() => {
        const nodeModel = this.modelSvc.getNodeById(this.id);
        if (!nodeModel) return;

        const updatedModel = {
          ...nodeModel,
          data: {
            ...nodeModel.data,
            text
          }
        };

        this.modelSvc.updateModel(this.id, updatedModel);

      });
    });
    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();
      
      untracked(() => {
        if (node) {
          this.dynamicHeader.set(node.data.headerSize);
          this.processContainerStyle(node);
        }
      })

      // console.log("on effect style:", this.dynamicStyle());
      // console.log("on effect header:", this.dynamicHeader());
    });
  }
  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  // readonly borderStylesSvc = inject(BorderStylesService);
  readonly enablerSvc = inject(EnablerService);
  readonly dragDropSvc = inject(DragDropService);
  readonly generalSvc = inject(GeneralFunctionsService);


  // readonly cornerStylesSvc = inject(CornerStylesService);

  text = signal<string>('');

  headerSize = signal('h1');
  id = '0';
  parentId = signal('-1')
  target = viewChild.required<ElementRef<HTMLHeadElement>>('target');
  nodeSignal: Signal<any> = signal(null);
  dynamicStyle: WritableSignal<any> = signal(null);
  dynamicHeader: WritableSignal<any> = signal(null);
  internalStyle: WritableSignal<any> = signal(null);
  externalStyle: WritableSignal<any> = signal(null);
  
  ngOnInit(): void {
    this.text.set(this.data.text ?? 'Your Title Here');
    // this.size.set(this.data.style.size ?? 1);
    this.id = this.data.id;
    this.parentId.set(this.data.parentId);
    this.headerSize.set(this.data.headerSize ?? 'h1');

    this.nodeSignal = computed(() => this.modelSvc.getNodeById(this.id));
    // this.dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke === 'true'), this.nodeSignal()?.data.type)());

    // console.log(this.nodeSignal()?.data.headerSize)
    this.dynamicHeader = signal(this.nodeSignal()?.data.headerSize);

  }

  processContainerStyle(node: any) {
    this.dynamicStyle.set(node.data.style);
    this.dynamicStyle.update(() => this.enablerSvc.changeStylesByEnablers(this.dynamicStyle(), (node.data.enabler), node.data.type)());
  
    const { outer, inner } = this.generalSvc.getSplitStyles(this.dynamicStyle());
    this.internalStyle.set(inner);
    this.externalStyle.set(outer);
  }


  ngAfterViewInit(): void {
    this.target().nativeElement.innerText = this.data.text ?? 'Your Title Here';

  }

  isFocused = computed(() => {
    return this.id === this.selectionSvc.selectedElementId();
  });

  isHovered = computed(() => {
    return this.id === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  textSyncOnBlur(event: Event) {
    const element = event.target as HTMLElement;
    const value = (event.target as HTMLElement).innerText;
    this.text.set(value);
  }

  onHandleClick() {
    this.isDragging.set(true);
    this.selectionSvc.selectById(this.id, true);
  }


  onDragMoved(event: CdkDragMove<any>) {
    this.dragDropSvc.onDragMoved(event);
  }

  // dropIndicator = computed(() => (this.isDragging() && this.isHovered()) ? this.dropIndicatorMap : '');
  dropIndicatorStyle = computed(() => (!this.isFocused() && this.isHovered()) ? this.dragDropSvc.dropIndicator(this.nodeSignal) : '');

}
