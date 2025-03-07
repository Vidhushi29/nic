import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseSummarySrpSdReportComponent } from './crop-wise-summary-srp-sd-report.component';

describe('CropWiseSummarySrpSdReportComponent', () => {
  let component: CropWiseSummarySrpSdReportComponent;
  let fixture: ComponentFixture<CropWiseSummarySrpSdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseSummarySrpSdReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseSummarySrpSdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
