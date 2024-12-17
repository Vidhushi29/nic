import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentBreederSeedAllocationDraftComponent } from './indent-breeder-seed-allocation-draft.component';

describe('IndentBreederSeedAllocationDraftComponent', () => {
  let component: IndentBreederSeedAllocationDraftComponent;
  let fixture: ComponentFixture<IndentBreederSeedAllocationDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentBreederSeedAllocationDraftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentBreederSeedAllocationDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
