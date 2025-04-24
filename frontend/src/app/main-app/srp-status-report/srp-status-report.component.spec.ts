import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpStatusReportComponent } from './srp-status-report.component';

describe('SrpStatusReportComponent', () => {
  let component: SrpStatusReportComponent;
  let fixture: ComponentFixture<SrpStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
