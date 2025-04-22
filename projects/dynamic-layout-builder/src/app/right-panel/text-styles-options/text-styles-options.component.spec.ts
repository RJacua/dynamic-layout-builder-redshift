import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextStylesOptionsComponent } from './text-styles-options.component';

describe('TextStylesOptionsComponent', () => {
  let component: TextStylesOptionsComponent;
  let fixture: ComponentFixture<TextStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
