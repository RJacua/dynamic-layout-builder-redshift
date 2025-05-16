import { AfterContentInit, AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, Signal, signal, untracked, viewChild } from '@angular/core';
import { HeaderData, LayoutElement } from '../interfaces/layout-elements';
import { CommonModule } from '@angular/common';
import { ComponentsService } from '../services/components.service';
import { ModelService } from '../services/model.service';
import { SelectionService } from '../services/selection.service';
import { BorderStylesService } from '../services/styles/borderStyles.service';
import { CdkDrag, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CornerStylesService } from '../services/styles/cornerStyles.service';

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
    //     this.modelSvc.updateModel(this.id(), model)
    //   )
    // });
    effect(() => {
      const node = this.nodeSignal();
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
        this.dynamicStyle.set(node.data.style);
        this.dynamicStyle.update(() => this.borderStylesSvc.changeBorderStylesByEnablers(this.dynamicStyle(), (this.nodeSignal()?.data.enabler.enableStroke), this.nodeSignal()?.data.type)());
        this.dynamicStyle.update(() => this.cornerStylesSvc.changeCornerStylesByEnablers(this.dynamicStyle(), (this.nodeSignal()?.data.enabler.enableIndividualCorner), this.nodeSignal()?.data.type)() ?? {});

      });
    });
    effect(() => {
      const node = this.nodeSignal();
      const canvasModel = this.modelSvc.hasCanvasModelChanged();

      if (node) {
        this.dynamicStyle.set(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke), this.nodeSignal()?.data.type)());
        this.dynamicHeader.set(node.data.headerSize);
      }

      // console.log("on effect style:", this.dynamicStyle());
      // console.log("on effect header:", this.dynamicHeader());
    });
  }
  readonly componentsSvc = inject(ComponentsService);
  readonly modelSvc = inject(ModelService);
  readonly selectionSvc = inject(SelectionService);
  readonly borderStylesSvc = inject(BorderStylesService);


  readonly cornerStylesSvc = inject(CornerStylesService);

  text = signal<string>('');

  headerSize = signal('h1');
  id = signal('0');
  parentId = signal('-1')
  data2 = input();
  target = viewChild.required<ElementRef<HTMLHeadElement>>('target');
  nodeSignal = computed(() => this.modelSvc.getNodeById(this.id()));
  dynamicStyle = signal(this.borderStylesSvc.changeBorderStylesByEnablers(this.nodeSignal()?.data.style, (this.nodeSignal()?.data.enabler.enableStroke), this.nodeSignal()?.data.type)());

  dynamicHeader = signal(this.nodeSignal()?.data.headerSize);

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

  isFocused = computed(() => {
    return this.id() === this.selectionSvc.selectedElementId();
  });

  isHovered = computed(() => {
    return this.id() === this.selectionSvc.hoveredElementId();
  });

  isDragging = this.selectionSvc.isDragging;

  textSyncOnBlur(event: Event) {
    const element = event.target as HTMLElement;
    const value = (event.target as HTMLElement).innerText;
    this.text.set(value);
  }

  onHandleClick() {
    this.isDragging.set(true);
    // console.log("handle click: ",this.selectionSvc.isDragging());
    this.selectionSvc.selectById(this.id(), true);
  }

}
