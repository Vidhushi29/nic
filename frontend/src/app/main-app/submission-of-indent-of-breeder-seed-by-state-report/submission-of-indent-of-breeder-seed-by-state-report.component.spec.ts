import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionOfIndentOfBreederSeedByStateReportComponent } from './submission-of-indent-of-breeder-seed-by-state-report.component';

describe('SubmissionOfIndentOfBreederSeedByStateReportComponent', () => {
  let component: SubmissionOfIndentOfBreederSeedByStateReportComponent;
  let fixture: ComponentFixture<SubmissionOfIndentOfBreederSeedByStateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionOfIndentOfBreederSeedByStateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionOfIndentOfBreederSeedByStateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
