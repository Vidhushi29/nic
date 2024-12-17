import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspTwoSecondReportComponent } from './bsp-two-second-report.component';

describe('BspTwoSecondReportComponent', () => {
  let component: BspTwoSecondReportComponent;
  let fixture: ComponentFixture<BspTwoSecondReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspTwoSecondReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspTwoSecondReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
