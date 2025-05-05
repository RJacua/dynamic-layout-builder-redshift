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

  @Input() data: Signal<Partial<LayoutElement<any>[]>> = signal([]);

  ngOnInit(): void {
    console.log(this.data());
    this.canvasModel = computed(() => this.data())
  }

  readonly modelSvc = inject(ModelService);

  canvasModel: any;

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
