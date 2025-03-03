import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseCsqsDistReportComponent } from './crop-wise-csqs-dist-report.component';

describe('CropWiseCsqsDistReportComponent', () => {
  let component: CropWiseCsqsDistReportComponent;
  let fixture: ComponentFixture<CropWiseCsqsDistReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseCsqsDistReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseCsqsDistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
