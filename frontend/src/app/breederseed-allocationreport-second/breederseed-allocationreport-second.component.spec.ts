import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederseedAllocationreportSecondComponent } from './breederseed-allocationreport-second.component';

describe('BreederseedAllocationreportSecondComponent', () => {
  let component: BreederseedAllocationreportSecondComponent;
  let fixture: ComponentFixture<BreederseedAllocationreportSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederseedAllocationreportSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederseedAllocationreportSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
