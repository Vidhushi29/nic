import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspTwoReportComponent } from './bsp-two-report.component';

describe('BspTwoReportComponent', () => {
  let component: BspTwoReportComponent;
  let fixture: ComponentFixture<BspTwoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspTwoReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspTwoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
