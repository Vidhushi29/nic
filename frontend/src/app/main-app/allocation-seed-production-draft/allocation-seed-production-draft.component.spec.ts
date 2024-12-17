import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationSeedProductionDraftComponent } from './allocation-seed-production-draft.component';

describe('AllocationSeedProductionDraftComponent', () => {
  let component: AllocationSeedProductionDraftComponent;
  let fixture: ComponentFixture<AllocationSeedProductionDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationSeedProductionDraftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationSeedProductionDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
