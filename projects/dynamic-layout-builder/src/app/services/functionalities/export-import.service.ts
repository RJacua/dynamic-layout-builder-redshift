import { inject, Injectable } from '@angular/core';
import { ModelService } from '../model.service';

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {

  constructor() { }

  readonly modelSvc = inject(ModelService);

  downloadModel(content: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.dl'; // nome sugerido para o arquivo
    a.click();

    // Limpeza de memória
    URL.revokeObjectURL(url);
  }

  importModel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dl';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;

        console.log(content);

        try {
          this.modelSvc.setCanvasByString(content);
          console.log('Modelo importado com sucesso!');
        } catch (err) {
          console.error('Erro ao importar modelo:', err);
          alert('O arquivo selecionado não é válido.');
        }
      };

      reader.readAsText(file);
    };

    input.click(); // abre a janela de seleção de arquivos
  }


}
