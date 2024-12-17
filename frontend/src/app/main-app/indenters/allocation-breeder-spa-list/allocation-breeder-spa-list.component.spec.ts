import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSpaListComponent } from './allocation-breeder-spa-list.component';

describe('AllocationBreederSpaListComponent', () => {
  let component: AllocationBreederSpaListComponent;
  let fixture: ComponentFixture<AllocationBreederSpaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSpaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSpaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
