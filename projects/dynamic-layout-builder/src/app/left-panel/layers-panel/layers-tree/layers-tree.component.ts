import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ModelService } from '../../../services/model.service';
import { SelectionService } from '../../../services/selection.service';
import { CdkDrag, CdkDragDrop, CdkDragMove, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropService as DragDropService } from '../../../services/dragdrop.service';

@Component({
  selector: 'app-layers-tree',
  imports: [MatTreeModule, MatIconModule, MatButtonModule, CommonModule, CdkDrag, DragDropModule],
  templateUrl: './layers-tree.component.html',
  styleUrl: './layers-tree.component.scss'
})
export class LayersTreeComponent {
  @Input() data: string = '0';
  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly dragDropSvc = inject(DragDropService);

  isSelected = computed(() => { return this.data === this.selectionSvc.selectedElementId() })
  isDragging = this.dragDropSvc.isDragging;

  isFocused = computed(() => {
    return this.data === this.selectionSvc.selectedElementId();
  });

  constructor() {
    effect(() => {
      const data = this.data;
      const lastAddedId = this.modelSvc.lastAddedNodeId();

      untracked(() =>
        this.expandNewNodeParents(lastAddedId)
      )
      // this.modelSvc.unsetLastAddedId()
    }
    )
  }

  ngOnInit(): void {
    if (this.data === "canvas") {
      this.nodeModel = computed(() => this.modelSvc.getNodeById(this.data));

    }
    else {
      this.nodeModel = computed(() => [this.modelSvc.getNodeById(this.data)])
    }
  }

  nodeModel: any;

  childrenAccessor = (node: any) => node?.data.children || [];

  isExpanded = signal(new Set<string>());

  toggleNode(nodeId: string) {
    const expanded = this.isExpanded();
    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
    } else {
      expanded.add(nodeId);
    }
    this.isExpanded.set(new Set(expanded));
    // console.log("isExpanded List: ", this.isExpanded())
  }

  expandNewNodeParents(nodeId: string) {
    if (nodeId === 'canvas') return;

    const parentsId = this.modelSvc.getGenealogicalTreeIdsById(nodeId);
    const expanded = this.isExpanded();
    parentsId.forEach(id => {
      expanded.add(id);
    });
    this.isExpanded.set(new Set(expanded));
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.isExpanded().has(nodeId);
  }
  onElementClick(event: MouseEvent) {
    event.stopPropagation();
    let el = event.target as HTMLElement;

    if (el.tagName === "MAT-ICON") {
      return
    }

    while (el && el.tagName && !el.tagName.startsWith('APP-') && el.parentElement) {
      el = el.parentElement;
    }

    if (el && el.tagName.startsWith('APP-')) {
      const componentInstance = (window as any).ng?.getComponent?.(el);

      if (componentInstance) {
        this.selectionSvc.selectById(componentInstance.data);
      } else {
        console.warn("ng.getComponent não disponível (modo produção?).");
      }
    }
  }

  onElementHover(event: MouseEvent) {
    let el = event.target as HTMLElement;

    while (el && !el.hasAttribute('data-id') && el.parentElement) {
      el = el.parentElement;
    }

    if (el && el.hasAttribute('data-id')) {
      const id = el.getAttribute('data-id');
      if (id) {
        this.selectionSvc.hoverById(id);
      }
    }
    // console.log("selected: ", this.selectionSvc.selectedElementId());
    // console.log("hovered: ", this.selectionSvc.hoveredElementId());
  }

  onElementMouseLeave(event: MouseEvent) {
    const toElement = event.relatedTarget as HTMLElement;

    let el = toElement;
    while (el && el !== document.body) {
      if (el.hasAttribute && el.hasAttribute('data-id')) {
        return;
      }
      el = el.parentElement!;
    }

    this.selectionSvc.unhover();
  }

  onDragMoved(event: CdkDragMove<any>) {
    this.selectionSvc.selectById(event.source.element.nativeElement.getAttribute('data-id')!, true);
    this.dragDropSvc.onDragMoved(event);
  }

  onDrop(event: CdkDragDrop<any>) {
    this.dragDropSvc.onDrop(event);
  }

}
