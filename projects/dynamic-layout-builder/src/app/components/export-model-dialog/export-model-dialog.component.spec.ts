import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportListDialogComponent } from './export-model-dialog.component';

describe('ExportListDialogComponent', () => {
  let component: ExportListDialogComponent;
  let fixture: ComponentFixture<ExportListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
