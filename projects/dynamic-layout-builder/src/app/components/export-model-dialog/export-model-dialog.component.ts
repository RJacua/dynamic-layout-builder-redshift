import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EncodeService } from '../../services/encode.service';
import { GeneralFunctionsService } from '../../services/general-functions.service';
import { ExportImportService } from '../../services/export-import.service';

@Component({
  selector: 'app-export-model-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions],
  templateUrl: './export-model-dialog.component.html',
  styleUrl: './export-model-dialog.component.css'
})
export class ExportModelDialogComponent {
  readonly encodeSvc = inject(EncodeService);
  readonly generalSvc = inject(GeneralFunctionsService);
  readonly dialogRef = inject(MatDialogRef<ExportModelDialogComponent>);
  readonly exportSvc = inject(ExportImportService);

  // modelArea = new FormControl<string>(this.generalSvc.customStringify(this.encodeSvc.canvasModel()), { nonNullable: true });
  modelArea = new FormControl<string>(
  JSON.stringify(this.encodeSvc.canvas(), null, 2),
  { nonNullable: true }
);


  copyListToClipboard() {
    navigator.clipboard.writeText(this.modelArea.value)
  }

  downloadModel() {
    this.exportSvc.downloadModel(this.modelArea.value);
  }

  closeListDialog(): void {
    this.dialogRef.close();
  }
}
