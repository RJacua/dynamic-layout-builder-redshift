import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaddingStylesOptionsComponent } from './padding-styles-options.component';

describe('PaddingStylesOptionsComponent', () => {
  let component: PaddingStylesOptionsComponent;
  let fixture: ComponentFixture<PaddingStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaddingStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaddingStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
