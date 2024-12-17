import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSeedIndentorLiftingFormComponent } from './allocation-breeder-seed-indentor-lifting-form.component';

describe('AllocationBreederSeedIndentorLiftingFormComponent', () => {
  let component: AllocationBreederSeedIndentorLiftingFormComponent;
  let fixture: ComponentFixture<AllocationBreederSeedIndentorLiftingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSeedIndentorLiftingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSeedIndentorLiftingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
