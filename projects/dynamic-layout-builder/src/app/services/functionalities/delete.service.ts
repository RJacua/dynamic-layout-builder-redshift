// delete.service.ts (exemplo)
import { Injectable, inject } from '@angular/core';
import { ModelService } from '../model.service';
import { SelectionService } from '../selection.service';
import { BannerService } from '../banner.service';

@Injectable({ providedIn: 'root' })
export class DeleteService {
  private modelSvc = inject(ModelService);
  private selection = inject(SelectionService);
  private banner = inject(BannerService);

  async confirmAndDeleteOne(id: string) {
    if (!id || id === 'canvas') return;

    const result = await this.banner.show({
      message: 'Are you sure you want to delete this element?',
      variant: 'warning',
      actions: [
        { id: 'no',  label: 'No' },
        { id: 'yes', label: 'Yes', kind: 'danger' },
      ]
    });

    if (result !== 'yes') return;

    this.modelSvc.removeNodeById(id);
    if (this.selection.selectedElementId() === id) this.selection.unselect();
  }

  async confirmAndDeleteMany(ids: string[]) {
    const valid = ids.filter(x => x && x !== 'canvas');
    if (!valid.length) return;

    const result = await this.banner.show({
      message: `Are you sure you want to delete ${valid.length} element(s)?`,
      variant: 'warning',
      actions: [
        { id: 'no',  label: 'No' },
        { id: 'yes', label: 'Yes', kind: 'danger' },
      ]
    });

    if (result !== 'yes') return;

    valid.forEach(id => this.modelSvc.removeNodeById(id));
    if (valid.includes(this.selection.selectedElementId())) this.selection.unselect();
  }
}
