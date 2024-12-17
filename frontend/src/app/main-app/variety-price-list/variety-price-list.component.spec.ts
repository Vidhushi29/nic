import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyPriceListComponent } from './variety-price-list.component';

describe('VarietyPriceListComponent', () => {
  let component: VarietyPriceListComponent;
  let fixture: ComponentFixture<VarietyPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyPriceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
