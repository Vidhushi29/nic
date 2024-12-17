import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionForIndentsOfBreederSeedReportComponent } from './submission-for-indents-of-breeder-seed-report.component';

describe('SubmissionForIndentsOfBreederSeedReportComponent', () => {
  let component: SubmissionForIndentsOfBreederSeedReportComponent;
  let fixture: ComponentFixture<SubmissionForIndentsOfBreederSeedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionForIndentsOfBreederSeedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionForIndentsOfBreederSeedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
