import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspFourReportSecondComponent } from './bsp-four-report-second.component';

describe('BspFourReportSecondComponent', () => {
  let component: BspFourReportSecondComponent;
  let fixture: ComponentFixture<BspFourReportSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspFourReportSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspFourReportSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
