import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ModelService } from '../../../services/model.service';
import { SelectionService } from '../../../services/selection.service';

@Component({
  selector: 'app-layers-tree',
  imports: [MatTreeModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './layers-tree.component.html',
  styleUrl: './layers-tree.component.scss'
})
export class LayersTreeComponent {
  @Input() data: string = '0';
  selectionService = inject(SelectionService);

  constructor() {
    effect(() => {
      const data = this.data;
      const test = this.modelSvc.hasCanvasModelChanged;
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

  readonly modelSvc = inject(ModelService);

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
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.isExpanded().has(nodeId);
  }
  onElementClick(event: MouseEvent) {
    event.stopPropagation();
    let el = event.target as HTMLElement;
  
    if(el.tagName === "MAT-ICON"){
      return
    }

    while (el && el.tagName && !el.tagName.startsWith('APP-') && el.parentElement) {
      el = el.parentElement;
    }
  
    if (el && el.tagName.startsWith('APP-')) {
      const componentInstance = (window as any).ng?.getComponent?.(el);
  
      if (componentInstance) {
        this.selectionService.selectById(componentInstance.data); 
      } else {
        console.warn("ng.getComponent não disponível (modo produção?).");
      }
    }
  }

}
