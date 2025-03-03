import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpIndenterMasterReportComponent } from './srp-indenter-master-report.component';

describe('SrpIndenterMasterReportComponent', () => {
  let component: SrpIndenterMasterReportComponent;
  let fixture: ComponentFixture<SrpIndenterMasterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpIndenterMasterReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpIndenterMasterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
