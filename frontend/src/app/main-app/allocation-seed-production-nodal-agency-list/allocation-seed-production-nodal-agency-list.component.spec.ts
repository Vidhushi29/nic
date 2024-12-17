import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationSeedProductionNodalAgencyListComponent } from './allocation-seed-production-nodal-agency-list.component';

describe('AllocationSeedProductionNodalAgencyListComponent', () => {
  let component: AllocationSeedProductionNodalAgencyListComponent;
  let fixture: ComponentFixture<AllocationSeedProductionNodalAgencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationSeedProductionNodalAgencyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationSeedProductionNodalAgencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
