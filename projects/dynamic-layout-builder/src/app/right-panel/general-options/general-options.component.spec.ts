import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOptionsComponent } from './general-options.component';

describe('GeneralOptionsComponent', () => {
  let component: GeneralOptionsComponent;
  let fixture: ComponentFixture<GeneralOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
