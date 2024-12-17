import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaAllocationReportComponent } from './spa-allocation-report.component';

describe('SpaAllocationPeportComponent', () => {
  let component: SpaAllocationReportComponent;
  let fixture: ComponentFixture<SpaAllocationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaAllocationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaAllocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
