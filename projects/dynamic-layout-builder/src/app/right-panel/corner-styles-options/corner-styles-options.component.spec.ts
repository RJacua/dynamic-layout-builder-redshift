import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CornerStylesOptionsComponent } from './corner-styles-options.component';

describe('CornerStylesOptionsComponent', () => {
  let component: CornerStylesOptionsComponent;
  let fixture: ComponentFixture<CornerStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CornerStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CornerStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
