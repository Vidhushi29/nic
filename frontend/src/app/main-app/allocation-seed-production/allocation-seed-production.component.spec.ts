import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationSeedProductionComponent } from './allocation-seed-production.component';

describe('AllocationSeedProductionComponent', () => {
  let component: AllocationSeedProductionComponent;
  let fixture: ComponentFixture<AllocationSeedProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationSeedProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationSeedProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
