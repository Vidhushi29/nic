import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCropVarietyReportComponent } from './assigned-crop-variety-report.component';

describe('AssignedCropVarietyReportComponent', () => {
  let component: AssignedCropVarietyReportComponent;
  let fixture: ComponentFixture<AssignedCropVarietyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedCropVarietyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedCropVarietyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
