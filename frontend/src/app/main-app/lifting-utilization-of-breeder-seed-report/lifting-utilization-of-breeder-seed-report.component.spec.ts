import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftingUtilizationOfBreederSeedReportComponent } from './lifting-utilization-of-breeder-seed-report.component';

describe('LiftingUtilizationOfBreederSeedReportComponent', () => {
  let component: LiftingUtilizationOfBreederSeedReportComponent;
  let fixture: ComponentFixture<LiftingUtilizationOfBreederSeedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiftingUtilizationOfBreederSeedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiftingUtilizationOfBreederSeedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
