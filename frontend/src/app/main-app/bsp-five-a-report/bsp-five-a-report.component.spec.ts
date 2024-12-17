import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspFiveAReportComponent } from './bsp-five-a-report.component';

describe('BspFiveAReportComponent', () => {
  let component: BspFiveAReportComponent;
  let fixture: ComponentFixture<BspFiveAReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspFiveAReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspFiveAReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
