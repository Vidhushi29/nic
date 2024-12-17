import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyWiseNucleusSeedComponent } from './variety-wise-nucleus-seed.component';

describe('VarietyWiseNucleusSeedComponent', () => {
  let component: VarietyWiseNucleusSeedComponent;
  let fixture: ComponentFixture<VarietyWiseNucleusSeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyWiseNucleusSeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyWiseNucleusSeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
