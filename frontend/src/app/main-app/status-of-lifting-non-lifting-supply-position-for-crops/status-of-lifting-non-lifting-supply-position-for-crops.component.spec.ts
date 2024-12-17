import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOfLiftingNonLiftingSupplyPositionForCropsComponent } from './status-of-lifting-non-lifting-supply-position-for-crops.component';

describe('StatusOfLiftingNonLiftingSupplyPositionForCropsComponent', () => {
  let component: StatusOfLiftingNonLiftingSupplyPositionForCropsComponent;
  let fixture: ComponentFixture<StatusOfLiftingNonLiftingSupplyPositionForCropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusOfLiftingNonLiftingSupplyPositionForCropsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOfLiftingNonLiftingSupplyPositionForCropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
