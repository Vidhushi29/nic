import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedTestingLaboratoryReportComponent } from './seed-testing-laboratory-report.component';

describe('SeedTestingLaboratoryReportComponent', () => {
  let component: SeedTestingLaboratoryReportComponent;
  let fixture: ComponentFixture<SeedTestingLaboratoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedTestingLaboratoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedTestingLaboratoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
