import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspIIIStatusReportComponent } from './bsp-iii-status-report.component';

describe('BspIIIStatusReportComponent', () => {
  let component: BspIIIStatusReportComponent;
  let fixture: ComponentFixture<BspIIIStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspIIIStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspIIIStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
