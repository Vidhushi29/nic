import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedMultiplicationRatioReportComponent } from './seed-multiplication-ratio-report.component';

describe('SeedMultiplicationRatioReportComponent', () => {
  let component: SeedMultiplicationRatioReportComponent;
  let fixture: ComponentFixture<SeedMultiplicationRatioReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedMultiplicationRatioReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedMultiplicationRatioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
