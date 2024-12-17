import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSeedSpaComponent } from './allocation-breeder-seed-spa.component';

describe('AllocationBreederSeedSpaComponent', () => {
  let component: AllocationBreederSeedSpaComponent;
  let fixture: ComponentFixture<AllocationBreederSeedSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSeedSpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSeedSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
