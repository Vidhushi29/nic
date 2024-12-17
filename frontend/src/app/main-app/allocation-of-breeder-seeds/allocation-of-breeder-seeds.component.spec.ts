import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationOfBreederSeedsComponent } from './allocation-of-breeder-seeds.component';

describe('AllocationOfBreederSeedsComponent', () => {
  let component: AllocationOfBreederSeedsComponent;
  let fixture: ComponentFixture<AllocationOfBreederSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationOfBreederSeedsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationOfBreederSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
