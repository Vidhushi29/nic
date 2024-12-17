import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentBreederSeedAllocationListComponent } from './indent-breeder-seed-allocation-list.component';

describe('IndentBreederSeedAllocationListComponent', () => {
  let component: IndentBreederSeedAllocationListComponent;
  let fixture: ComponentFixture<IndentBreederSeedAllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentBreederSeedAllocationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentBreederSeedAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
