import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectionOfSpaForSubmissionIndentComponent } from './view-selection-of-spa-for-submission-indent.component';

describe('ViewSelectionOfSpaForSubmissionIndentComponent', () => {
  let component: ViewSelectionOfSpaForSubmissionIndentComponent;
  let fixture: ComponentFixture<ViewSelectionOfSpaForSubmissionIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectionOfSpaForSubmissionIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSelectionOfSpaForSubmissionIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
