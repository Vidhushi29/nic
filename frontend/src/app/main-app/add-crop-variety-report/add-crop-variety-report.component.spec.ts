import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropVarietyReportComponent } from './add-crop-variety-report.component';

describe('AddCropVarietyReportComponent', () => {
  let component: AddCropVarietyReportComponent;
  let fixture: ComponentFixture<AddCropVarietyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropVarietyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropVarietyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
