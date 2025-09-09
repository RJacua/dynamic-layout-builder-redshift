import { inject, Injectable, signal } from '@angular/core';
import { ModelService } from '../model.service';
import { SelectionService } from '../selection.service';
import { LayoutElement, ContainerData, AtomicElementData } from '../../interfaces/layout-elements';
import { BannerService } from '../banner.service';

type AnyNode = LayoutElement<ContainerData | AtomicElementData>;

@Injectable({ providedIn: 'root' })
export class CopyPasteService {
  private modelSvc = inject(ModelService);
  private selectionSvc = inject(SelectionService);
  private banner = inject(BannerService);

  private clipboard: AnyNode | null = null;

  hasClipboard = signal(false);
  lastError = signal<string>('');

  private showError(message: string, auto = 2800) {
    this.lastError.set(message);
    this.banner.show({
      message,
      variant: 'error',
      actions: [{ id: 'ok', label: 'OK', kind: 'primary' }],
      autoHideMs: auto
    });
  }

  private showInfo(message: string, auto = 2200) {
    this.banner.show({
      message,
      variant: 'info',
      actions: [{ id: 'ok', label: 'OK', kind: 'primary' }],
      autoHideMs: auto
    });
  }

  private showInvalidTarget() {
    this.banner.show({
      message: 'Please select a valid target.',
      variant: 'error',
      actions: [{ id: 'ok', label: 'OK', kind: 'primary' }],
      autoHideMs: 2500
    });
  }
  // --------------------------------------------------------------------------

  copyById(nodeId: string): void {
    const node = this.modelSvc.getNodeById(nodeId) as AnyNode | undefined;
    if (!node) return this.showError('Nothing to copy.');

    this.clipboard = JSON.parse(JSON.stringify(node));
    this.hasClipboard.set(true);
    this.lastError.set('');
    this.showInfo('Copied.');
  }

  copySelection(): void {
    const id = this.selectionSvc.selectedElementId();
    if (!id) return this.showError('Nothing selected.');
    this.copyById(id);
  }

  cutById(nodeId: string): void {
    const node = this.modelSvc.getNodeById(nodeId) as AnyNode | undefined;
    if (!node) return this.showError('Nothing to cut.');
    if (node.data.type === 'canvas') return this.showError("Can't cut the canvas.");

    this.clipboard = JSON.parse(JSON.stringify(node));
    this.hasClipboard.set(true);

    this.modelSvc.removeNodeById(nodeId);
    this.selectionSvc.unselect();
    this.lastError.set('');

    this.showInfo('Cut.');
  }

  cutSelection(): void {
    const id = this.selectionSvc.selectedElementId();
    if (!id || id === 'canvas') return this.showError('Nothing to cut.');
    this.cutById(id);
  }

  pasteToSelection(): void {
    const targetId = this.selectionSvc.selectedElementId() || 'canvas';
    this.pasteInto(targetId);
  }

  pasteInto(targetId: string): void {
    if (!this.clipboard) return this.showError('Clipboard is empty.');

    const target =
      targetId === 'canvas'
        ? ({ data: { id: 'canvas', type: 'canvas' } } as AnyNode)
        : (this.modelSvc.getNodeById(targetId) as AnyNode | undefined);

    if (!target) return this.showInvalidTarget();

    const source = this.clipboard;

    const targetIsCanvas = targetId === 'canvas';
    const sourceIsContainer = source.data.type === 'container';
    const targetIsContainer = target.data.type === 'container';

    // Regras de validade
    if (targetIsCanvas && !sourceIsContainer) return this.showInvalidTarget();
    if (!targetIsCanvas && !targetIsContainer) return this.showInvalidTarget();

    // Clona com novos ids
    const cloned = this.cloneWithNewIds(source, targetIsCanvas ? 'canvas' : targetId);

    // Cola
    let newId = '';
    if (targetIsCanvas) {
      newId = this.modelSvc.addChildNode('canvas', cloned as LayoutElement<ContainerData>)!;
    } else {
      newId = this.modelSvc.addChildNode(targetId, cloned)!;
    }

    // Seleciona o novo item (qualidade de vida)
    if (newId) this.selectionSvc.selectById(newId, true);

    this.hasClipboard.set(true);
    this.lastError.set('');

    this.showInfo('Pasted.');
  }

  private cloneWithNewIds(node: AnyNode, newParentId: string): AnyNode {
    const newId = 'n-' + crypto.randomUUID().split('-')[0];

    const data: any = {
      ...node.data,
      id: newId,
      parentId: newParentId,
    };

    if (typeof data.name === 'string') {
      data.name = this.makeCopyName(data.name);
    }

    if (node.data.type === 'container' && Array.isArray((node.data as any).children)) {
      const children = (node.data as any).children as AnyNode[];
      data.children = children.map(child => this.cloneWithNewIds(child, newId));
    } else {
      delete data.children;
    }

    return { data } as AnyNode;
  }

  private makeCopyName(original: string): string {
    const trimmed = original.replace(/\s+\(copy\)$/i, '');
    return `${trimmed} (copy)`;
  }

  
}
