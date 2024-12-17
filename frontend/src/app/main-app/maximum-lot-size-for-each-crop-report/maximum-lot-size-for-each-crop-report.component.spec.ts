import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumLotSizeForEachCropReportComponent } from './maximum-lot-size-for-each-crop-report.component';

describe('MaximumLotSizeForEachCropReportComponent', () => {
  let component: MaximumLotSizeForEachCropReportComponent;
  let fixture: ComponentFixture<MaximumLotSizeForEachCropReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumLotSizeForEachCropReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximumLotSizeForEachCropReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
