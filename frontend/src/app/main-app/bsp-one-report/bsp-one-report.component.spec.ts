import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspOneReportComponent } from './bsp-one-report.component';

describe('BspOneReportComponent', () => {
  let component: BspOneReportComponent;
  let fixture: ComponentFixture<BspOneReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspOneReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspOneReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
