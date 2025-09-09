import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ModelService } from '../../../services/model.service';
import { SelectionService } from '../../../services/selection.service';
import { CdkDrag, CdkDragDrop, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropService as DragDropService } from '../../../services/dragdrop.service';

@Component({
  selector: 'app-layers-tree',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './layers-tree.component.html',
  styleUrl: './layers-tree.component.scss'
})
export class LayersTreeComponent {
  @Input() data: string = '0';
  @Input() depth = 0;              // <-- novo
  indentPx = 16;                   // <-- controla quanto indenta por nível

  readonly selectionSvc = inject(SelectionService);
  readonly modelSvc = inject(ModelService);
  readonly dragDropSvc = inject(DragDropService);

  isSelected = computed(() => {
    return this.data.replace('tree-', '') === this.selectionSvc.selectedElementId();
  });

  isDragging = this.dragDropSvc.isDragging;

  isFocused = computed(() => {
    return this.data.replace('tree-', '') === this.selectionSvc.selectedElementId();
  });

  nodeModel: any;
  childrenAccessor = (node: any) => node?.data.children || [];
  isExpanded = this.modelSvc.expandedNodes;

  // --- Controle de edição ---
  editingId = signal<string | null>(null);
  originalName = '';

  constructor() {
    effect(() => {
      const data = this.data;
      const lastAddedId = this.modelSvc.lastAddedNodeId();
      const selectedElementId = this.selectionSvc.selectedElementId();

      untracked(() => {
        this.expandNewNodeParents(lastAddedId);
        this.expandNewNodeParents(this.selectionSvc.selectedElementId());
      });
    });
  }

  
  nodeSignal = this.modelSvc.getNodeSignalById('canvas'); // init; set no ngOnInit

  ngOnInit(): void {
    const id = this.data.replace('tree-', ''); // garantia
    this.nodeSignal = this.modelSvc.getNodeSignalById(id);

    if (id === 'canvas') {
      this.nodeModel = computed(() => this.modelSvc.getNodeById(id));
    } else {
      this.nodeModel = computed(() => [this.modelSvc.getNodeById(id)]);
    }
  }

  onDragStart(node: any) {
    this.dragDropSvc.isDragging.set(true);
    this.selectionSvc.selectById(node.data.id, true);
  }

  onDragMoved(event: CdkDragMove<any>) {
    // seleciona quem está sendo arrastado
    const draggedId = event.source.element.nativeElement.getAttribute('data-id');
    if (draggedId) this.selectionSvc.selectById(draggedId, true);

    // atualiza qual nó está sob o ponteiro (hover)
    const { x, y } = event.pointerPosition;
    let el = document.elementFromPoint(x, y) as HTMLElement | null;
    while (el && !el.hasAttribute('data-id') && el.parentElement) el = el.parentElement;
    const hoveredId = el?.getAttribute('data-id');
    if (hoveredId) this.selectionSvc.hoverById(hoveredId);

    // alimenta o serviço (calcula dropTarget, dropIndex e indicadores)
    this.dragDropSvc.onDragMoved(event);
  }

  onDrop(event: CdkDragDrop<any>) {
    this.dragDropSvc.onDrop(event);
  }

  toggleNode(nodeId: string) {
    const expanded = this.isExpanded();
    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
    } else {
      expanded.add(nodeId);
    }
    this.isExpanded.set(new Set(expanded));
  }

  expandNewNodeParents(nodeId: string) {
    if (nodeId === 'canvas') return;

    const parentsId = this.modelSvc.getGenealogicalTreeIdsById(nodeId);
    const expanded = this.isExpanded();
    parentsId.forEach((id) => expanded.add(id));
    this.isExpanded.set(new Set(expanded));
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.isExpanded().has(nodeId);
  }

  // onElementClick(event: MouseEvent) {
  //   event.stopPropagation();
  //   let el = event.target as HTMLElement;

  //   if (el.tagName === 'MAT-ICON') {
  //     return;
  //   }

  //   while (el && el.tagName && !el.tagName.startsWith('APP-') && el.parentElement) {
  //     el = el.parentElement;
  //   }

  //   if (el && el.tagName.startsWith('APP-')) {
  //     const componentInstance = (window as any).ng?.getComponent?.(el);

  //     if (componentInstance) {
  //       this.selectionSvc.selectById(componentInstance.data);
  //     } else {
  //       console.warn('ng.getComponent não disponível (modo produção?).');
  //     }
  //   }
  // }


  // Seleciona diretamente a linha clicada
selectRow(id: string, ev?: MouseEvent) {
  if (ev) ev.stopPropagation();
  this.selectionSvc.selectById(id, true);
}

// Fallback: delegação por data-id (SEM window.ng)
onElementClick(event: MouseEvent) {
  event.stopPropagation();

  // Ignora clique no ícone de expandir/colapsar
  const target = event.target as HTMLElement;
  if (target.tagName === 'MAT-ICON') return;

  const hit = target.closest('[data-id]') as HTMLElement | null;
  if (!hit) return;

  const id = hit.getAttribute('data-id');
  if (!id) return;

  this.selectionSvc.selectById(id, true);
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

    const dataId = el.getAttribute('data-id');
    if (this.isDragging() && dataId) {
      this.expandNewNodeParents(dataId);
    }
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

  // onDragMoved(event: CdkDragMove<any>) {
  //   this.selectionSvc.selectById(
  //     event.source.element.nativeElement.getAttribute('data-id')!,
  //     true
  //   );
  //   this.dragDropSvc.onDragMoved(event);
  // }

  // onDrop(event: CdkDragDrop<any>) {
  //   this.dragDropSvc.onDrop(event);
  // }

  // --- Métodos de edição ---
  startEdit(node: any) {
    this.editingId.set(node.data.id);
    this.originalName = node.data.name ?? '';
  }

  endEdit(node: any, ev: FocusEvent) {
    const el = ev.target as HTMLElement;
    const newName = el.innerText.replace(/\n/g, '').trim();

    if (newName && newName !== node.data.name) {
      // Atualiza o modelo global (implemente este método no ModelService)
      this.modelSvc.renameNode(node.data.id, newName);
      node.data.name = newName; // garante sincronização local
    } else {
      el.innerText = node.data.name ?? '';
    }

    this.editingId.set(null);
  }

  commitEdit(ev: Event) {
    ev.preventDefault();
    (ev.target as HTMLElement).blur();
  }

  cancelEdit(ev: Event) {
    ev.preventDefault();
    (ev.target as HTMLElement).innerText = this.originalName;
    (ev.target as HTMLElement).blur();
  }


}
