import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationOfBreederSeedsToIndentorsForLiftingReportComponent } from './allocation-of-breeder-seeds-to-indentors-for-lifting-report.component';

describe('AllocationOfBreederSeedsToIndentorsForLiftingReportComponent', () => {
  let component: AllocationOfBreederSeedsToIndentorsForLiftingReportComponent;
  let fixture: ComponentFixture<AllocationOfBreederSeedsToIndentorsForLiftingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationOfBreederSeedsToIndentorsForLiftingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationOfBreederSeedsToIndentorsForLiftingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
