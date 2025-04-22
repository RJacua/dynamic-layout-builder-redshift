import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundStylesOptionsComponent } from './background-styles-options.component';

describe('GeneralOptionsComponent', () => {
  let component: BackgroundStylesOptionsComponent;
  let fixture: ComponentFixture<BackgroundStylesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundStylesOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundStylesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
