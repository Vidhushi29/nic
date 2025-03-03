import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpIndenterCropWiseSummaryReportComponent } from './srp-indenter-crop-wise-summary-report.component';

describe('SrpIndenterCropWiseSummaryReportComponent', () => {
  let component: SrpIndenterCropWiseSummaryReportComponent;
  let fixture: ComponentFixture<SrpIndenterCropWiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpIndenterCropWiseSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpIndenterCropWiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
