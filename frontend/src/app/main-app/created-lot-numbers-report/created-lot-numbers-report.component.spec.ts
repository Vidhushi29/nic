import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedLotNumbersReportComponent } from './created-lot-numbers-report.component';

describe('CreatedLotNumbersReportComponent', () => {
  let component: CreatedLotNumbersReportComponent;
  let fixture: ComponentFixture<CreatedLotNumbersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedLotNumbersReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedLotNumbersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
