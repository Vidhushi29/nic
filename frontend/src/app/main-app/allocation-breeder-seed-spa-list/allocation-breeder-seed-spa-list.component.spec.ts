import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSeedSpaListComponent } from './allocation-breeder-seed-spa-list.component';

describe('AllocationBreederSeedSpaListComponent', () => {
  let component: AllocationBreederSeedSpaListComponent;
  let fixture: ComponentFixture<AllocationBreederSeedSpaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSeedSpaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSeedSpaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
