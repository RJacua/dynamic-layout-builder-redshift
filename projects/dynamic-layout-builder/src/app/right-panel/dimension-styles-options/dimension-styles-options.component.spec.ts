import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionStylesOptionsComponent } from './dimension-styles-options.component';

describe('DimensionStylesOptionsComponent', () => {
  let component: DimensionStylesOptionsComponent;
  let fixture: ComponentFixture<DimensionStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimensionStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensionStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
