import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeBasicOptionsComponent } from './iframe-basic-options.component';

describe('IframeBasicOptionsComponent', () => {
  let component: IframeBasicOptionsComponent;
  let fixture: ComponentFixture<IframeBasicOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeBasicOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeBasicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
