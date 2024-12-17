import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCenterWiseDetailsReportComponent } from './production-center-wise-details-report.component';

describe('ProductionCenterWiseDetailsReportComponent', () => {
  let component: ProductionCenterWiseDetailsReportComponent;
  let fixture: ComponentFixture<ProductionCenterWiseDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionCenterWiseDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCenterWiseDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
