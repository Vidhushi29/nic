import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionOfSpaForSubmissionIndentComponent } from './selection-of-spa-for-submission-indent.component';

describe('SelectionOfSpaForSubmissionIndentComponent', () => {
  let component: SelectionOfSpaForSubmissionIndentComponent;
  let fixture: ComponentFixture<SelectionOfSpaForSubmissionIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionOfSpaForSubmissionIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionOfSpaForSubmissionIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
