import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSeedIndentorLiftingListComponent } from './allocation-breeder-seed-indentor-lifting-list.component';

describe('AllocationBreederSeedIndentorLiftingListComponent', () => {
  let component: AllocationBreederSeedIndentorLiftingListComponent;
  let fixture: ComponentFixture<AllocationBreederSeedIndentorLiftingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSeedIndentorLiftingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSeedIndentorLiftingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
