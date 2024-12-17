import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent } from './status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report.component';

describe('StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent', () => {
  let component: StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent;
  let fixture: ComponentFixture<StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
