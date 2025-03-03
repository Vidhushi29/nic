import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpIndenterCropWiseReportComponent } from './srp-indenter-crop-wise-report.component';

describe('SrpIndenterCropWiseReportComponent', () => {
  let component: SrpIndenterCropWiseReportComponent;
  let fixture: ComponentFixture<SrpIndenterCropWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpIndenterCropWiseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpIndenterCropWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
