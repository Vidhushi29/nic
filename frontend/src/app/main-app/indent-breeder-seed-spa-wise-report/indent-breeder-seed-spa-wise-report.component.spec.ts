import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentBreederSeedSpaWiseReportComponent } from './indent-breeder-seed-spa-wise-report.component';

describe('IndentBreederSeedSpaWiseReportComponent', () => {
  let component: IndentBreederSeedSpaWiseReportComponent;
  let fixture: ComponentFixture<IndentBreederSeedSpaWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentBreederSeedSpaWiseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentBreederSeedSpaWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
