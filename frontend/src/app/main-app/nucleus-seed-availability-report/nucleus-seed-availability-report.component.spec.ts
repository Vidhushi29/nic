import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleusSeedAvailabilityReportComponent } from './nucleus-seed-availability-report.component';

describe('NucleusSeedAvailabilityReportComponent', () => {
  let component: NucleusSeedAvailabilityReportComponent;
  let fixture: ComponentFixture<NucleusSeedAvailabilityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NucleusSeedAvailabilityReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NucleusSeedAvailabilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
