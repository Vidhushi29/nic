import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedTestingLaboratoryResultsReportsComponent } from './seed-testing-laboratory-results-reports.component';

describe('SeedTestingLaboratoryResultsReportsComponent', () => {
  let component: SeedTestingLaboratoryResultsReportsComponent;
  let fixture: ComponentFixture<SeedTestingLaboratoryResultsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedTestingLaboratoryResultsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedTestingLaboratoryResultsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
