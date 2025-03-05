import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseSrpSdReportComponent } from './crop-wise-srp-sd-report.component';

describe('CropWiseSrpSdReportComponent', () => {
  let component: CropWiseSrpSdReportComponent;
  let fixture: ComponentFixture<CropWiseSrpSdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseSrpSdReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseSrpSdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
