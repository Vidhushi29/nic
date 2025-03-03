import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateVarietyWiseCsqsDistReportComponent } from './state-variety-wise-csqs-dist-report.component';

describe('StateVarietyWiseCsqsDistReportComponent', () => {
  let component: StateVarietyWiseCsqsDistReportComponent;
  let fixture: ComponentFixture<StateVarietyWiseCsqsDistReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateVarietyWiseCsqsDistReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateVarietyWiseCsqsDistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
