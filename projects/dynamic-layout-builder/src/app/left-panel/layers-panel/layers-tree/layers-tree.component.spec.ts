import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersTreeComponent } from './layers-tree.component';

describe('LayersTreeComponent', () => {
  let component: LayersTreeComponent;
  let fixture: ComponentFixture<LayersTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayersTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayersTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
