import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginStylesOptionsComponent } from './margin-styles-options.component';

describe('MarginStylesOptionsComponent', () => {
  let component: MarginStylesOptionsComponent;
  let fixture: ComponentFixture<MarginStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarginStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarginStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
