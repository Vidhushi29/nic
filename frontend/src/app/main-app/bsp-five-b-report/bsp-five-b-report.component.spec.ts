import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspFiveBReportComponent } from './bsp-five-b-report.component';

describe('BspFiveBReportComponent', () => {
  let component: BspFiveBReportComponent;
  let fixture: ComponentFixture<BspFiveBReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspFiveBReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspFiveBReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
