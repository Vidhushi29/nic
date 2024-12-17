import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropReportComponent } from './add-crop-report.component';

describe('AddCropReportComponent', () => {
  let component: AddCropReportComponent;
  let fixture: ComponentFixture<AddCropReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
