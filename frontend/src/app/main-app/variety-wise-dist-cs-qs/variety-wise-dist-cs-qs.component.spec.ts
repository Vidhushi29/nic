import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyWiseDistCsQsComponent } from './variety-wise-dist-cs-qs.component';

describe('VarietyWiseDistCsQsComponent', () => {
  let component: VarietyWiseDistCsQsComponent;
  let fixture: ComponentFixture<VarietyWiseDistCsQsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyWiseDistCsQsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyWiseDistCsQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
