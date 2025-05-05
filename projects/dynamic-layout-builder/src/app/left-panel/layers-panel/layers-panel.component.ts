import { Component, computed, effect, inject, Input, signal, Signal } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { LayoutElement } from '../../interfaces/layout-elements';


@Component({
  selector: 'app-layers-panel',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './layers-panel.component.html',
  styleUrl: './layers-panel.component.scss'
})
export class LayersPanelComponent {

  @Input() data: string = '0';

  constructor(){
    effect(() => {
      const data = this.data;
      const test = this.modelSvc.hasCanvasModelChanged;
      console.log(data)
    }
    )
  }

  ngOnInit(): void {
    if(this.data === "canvas"){
      this.nodeModel = computed(() => this.modelSvc.getNodeById(this.data))
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
}
