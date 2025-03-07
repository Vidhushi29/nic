import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropVarietyWiseSrpSdReportComponent } from './crop-variety-wise-srp-sd-report.component';

describe('CropVarietyWiseSrpSdReportComponent', () => {
  let component: CropVarietyWiseSrpSdReportComponent;
  let fixture: ComponentFixture<CropVarietyWiseSrpSdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropVarietyWiseSrpSdReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropVarietyWiseSrpSdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
