import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentBreederSeedAllocationSearchComponent } from './indent-breeder-seed-allocation-search.component';

describe('IndentBreederSeedAllocationSearchComponent', () => {
  let component: IndentBreederSeedAllocationSearchComponent;
  let fixture: ComponentFixture<IndentBreederSeedAllocationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentBreederSeedAllocationSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentBreederSeedAllocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
