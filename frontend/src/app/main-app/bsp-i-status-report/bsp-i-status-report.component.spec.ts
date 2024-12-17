import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspIStatusReportComponent } from './bsp-i-status-report.component';

describe('BspIStatusReportComponent', () => {
  let component: BspIStatusReportComponent;
  let fixture: ComponentFixture<BspIStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspIStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspIStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
