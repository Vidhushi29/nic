import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspIiStatusReportComponent } from './bsp-ii-status-report.component';

describe('BspIiStatusReportComponent', () => {
  let component: BspIiStatusReportComponent;
  let fixture: ComponentFixture<BspIiStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspIiStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspIiStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
