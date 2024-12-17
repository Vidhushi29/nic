import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionDashboardSecondComponent } from './production-dashboard-second.component';

describe('ProductionDashboardSecondComponent', () => {
  let component: ProductionDashboardSecondComponent;
  let fixture: ComponentFixture<ProductionDashboardSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionDashboardSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionDashboardSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
