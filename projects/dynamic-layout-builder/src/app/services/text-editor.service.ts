import { inject, Injectable } from '@angular/core';
import { ModelService } from './model.service';
import { SelectionService } from './selection.service';

@Injectable({ providedIn: 'root' })
export class TextEditorService {
  constructor() { }
  private modelSvc = inject(ModelService);
  private selectionSvc = inject(SelectionService);

  createLink(nodeId: string, url: string = 'https://[YOU URL HERE]') {
  const node = this.modelSvc.getNodeById(nodeId);
  if (!node || node.data.type !== 'paragraph') return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText) return;

  const container = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
  if (!container) {
    console.log("div nao encontrado");
    return;
  }

  const paragraph = container.querySelector('p');
  if (!paragraph) {
    console.log("p nao encontrado");
    return;
  }

  // Cria o link
  const linkEl = document.createElement('a');
  linkEl.href = url;
  linkEl.target = '_blank';
  linkEl.textContent = selectedText;

  // Substitui o conteúdo da seleção pelo link
  range.deleteContents();
  range.insertNode(linkEl);

  // Atualiza o modelo (removendo ícones de botão, se houver)
  const cloned = paragraph.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll('button[data-link-icon="true"]').forEach(btn => btn.remove());
  const updatedHTML = cloned.innerHTML;

  const updatedNode = {
    ...node,
    data: {
      ...node.data,
      text: updatedHTML
    }
  };
  this.modelSvc.updateModel(nodeId, updatedNode);

  // Limpa a seleção
  selection.removeAllRanges();
}


  insertLinkIcons(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const links = doc.querySelectorAll('a');

    links.forEach((link, index) => {
      const prev = link.nextSibling;
      if (prev && (prev as HTMLElement).dataset?.['linkIcon'] === 'true') return;

      const button = doc.createElement('button');
      button.type = 'button';
      button.innerText = '🔗';
      button.classList.add('link-icon-button');
      button.dataset['linkIcon'] = 'true';
      button.dataset['id'] = `link`;

      button.setAttribute('contenteditable', 'false');
      button.setAttribute('tabindex', '-1');
      button.style.userSelect = 'none';
      button.style.pointerEvents = 'auto';

      link.parentElement?.insertBefore(button, link.nextSibling);
    });

    return doc.body.innerHTML;
  }

  attachLinkHandlers(container: HTMLElement, nodeId: string) {
    const buttons = container.querySelectorAll('button[data-link-icon="true"]');

    buttons.forEach(button => {
      const link = button.previousElementSibling as HTMLAnchorElement;
      if (!link || link.tagName.toLowerCase() !== 'a') return;

      (button as HTMLElement).onclick = () => {
        const currentUrl = link.getAttribute('href') ?? '';
        const newUrl = prompt('Editar URL do link:', currentUrl);

        if (newUrl && newUrl.trim()) {
          link.setAttribute('href', newUrl.trim());

          const cloned = container.cloneNode(true) as HTMLElement;
          cloned.querySelectorAll('button[data-link-icon="true"]')?.forEach(btn => btn.remove());

          const updatedText = cloned.innerHTML;

          const node = this.modelSvc.getNodeById(nodeId);
          if (!node) return;

          const updatedModel = {
            ...node,
            data: {
              ...node.data,
              text: updatedText
            }
          };

          this.modelSvc.updateModel(nodeId, updatedModel);
        }
      };
    });
  }


}
