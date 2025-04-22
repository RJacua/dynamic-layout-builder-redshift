import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertPanelComponent } from './insert-panel.component';

describe('InsertPanelComponent', () => {
  let component: InsertPanelComponent;
  let fixture: ComponentFixture<InsertPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
