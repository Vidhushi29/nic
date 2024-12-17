import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropStatusReportComponent } from './crop-status-report.component';

describe('CropStatusReportComponent', () => {
  let component: CropStatusReportComponent;
  let fixture: ComponentFixture<CropStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
