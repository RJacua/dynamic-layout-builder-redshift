import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderStylesOptionsComponent } from './border-styles-options.component';

describe('BorderStylesOptionsComponent', () => {
  let component: BorderStylesOptionsComponent;
  let fixture: ComponentFixture<BorderStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorderStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorderStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
