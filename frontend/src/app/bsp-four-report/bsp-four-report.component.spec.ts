import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspFourReportComponent } from './bsp-four-report.component';

describe('BspFourReportComponent', () => {
  let component: BspFourReportComponent;
  let fixture: ComponentFixture<BspFourReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspFourReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspFourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
