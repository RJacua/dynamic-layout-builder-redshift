import { inject, Injectable } from '@angular/core';
import { ModelService } from './model.service';

@Injectable({ providedIn: 'root' })
export class TextEditorService {
  private modelSvc = inject(ModelService);

  // guarda a última seleção válida por nodeId
  private armedRangeByNode = new Map<string, Range>();

  armSelection(nodeId: string) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    this.armedRangeByNode.set(nodeId, sel.getRangeAt(0).cloneRange());
  }

  private findParagraphFromRange(r: Range, nodeId: string): HTMLParagraphElement | null {
    const startEl = (r.startContainer.nodeType === 3
      ? (r.startContainer.parentElement as Element)
      : (r.startContainer as Element)
    );
    // sobe até o root do componente Paragraph específico
    const host = startEl.closest(`.main.paragraph.canvas-item[data-id="${nodeId}"]`);
    if (!host) return null;
    return host.querySelector('p');
  }

  createLink(nodeId: string, urlSeed = 'https://[YOU URL HERE]') {
    const node = this.modelSvc.getNodeById(nodeId);
    if (!node || node.data.type !== 'paragraph') return;

    // 1) usa a seleção "armada" primeiro; se não houver, tenta a atual
    let range: Range | null = this.armedRangeByNode.get(nodeId) ?? null;
    if (!range) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      range = sel.getRangeAt(0).cloneRange();
    }

    // 2) valida que a range está dentro do <p> correto
    const p = this.findParagraphFromRange(range, nodeId);
    if (!p) return;

    const selectedText = range.toString();
    if (!selectedText) return;

    const finalUrl = prompt('Enter link URL:', urlSeed);
    if (!finalUrl) return;

    // 3) cria o link preservando a estrutura da seleção
    const frag = range.extractContents();
    const a = document.createElement('a');
    a.href = finalUrl;
    a.target = '_blank';
    a.appendChild(frag);
    range.insertNode(a);

    // 4) salva no modelo (limpando ícones)
    const cloned = p.cloneNode(true) as HTMLElement;
    cloned.querySelectorAll('button[data-link-icon="true"]').forEach(b => b.remove());
    const updatedHTML = cloned.innerHTML;

    const updatedNode = { ...node, data: { ...node.data, text: updatedHTML } };
    this.modelSvc.updateModel(nodeId, updatedNode);

    // 5) re-renderiza com ícones e handlers
    p.innerHTML = this.insertLinkIcons(updatedHTML);
    this.attachLinkHandlers(p, nodeId);

    // limpa seleções
    this.armedRangeByNode.delete(nodeId);
    const sel = window.getSelection();
    sel?.removeAllRanges();
  }

  insertLinkIcons(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('a').forEach(link => {
      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.innerText = '🔗';
      btn.classList.add('link-icon-button');
      btn.dataset['linkIcon'] = 'true';
      btn.setAttribute('contenteditable', 'false');
      btn.setAttribute('tabindex', '-1');
      btn.style.userSelect = 'none';
      btn.style.pointerEvents = 'auto';
      link.parentElement?.insertBefore(btn, link.nextSibling);
    });
    return doc.body.innerHTML;
  }

  attachLinkHandlers(container: HTMLElement, nodeId: string) {
    container.querySelectorAll('button[data-link-icon="true"]').forEach(button => {
      const link = button.previousElementSibling as HTMLAnchorElement | null;
      if (!link || link.tagName.toLowerCase() !== 'a') return;

      (button as HTMLElement).onclick = () => {
        const currentUrl = link.getAttribute('href') ?? '';
        const newUrl = prompt('Edit link URL:', currentUrl);
        if (!newUrl || !newUrl.trim()) return;

        link.setAttribute('href', newUrl.trim());

        const cloned = container.cloneNode(true) as HTMLElement;
        cloned.querySelectorAll('button[data-link-icon="true"]').forEach(b => b.remove());
        const updated = cloned.innerHTML;

        const n = this.modelSvc.getNodeById(nodeId);
        if (!n) return;
        const updatedNode = { ...n, data: { ...n.data, text: updated } };
        this.modelSvc.updateModel(nodeId, updatedNode);
      };
    });
  }
}
