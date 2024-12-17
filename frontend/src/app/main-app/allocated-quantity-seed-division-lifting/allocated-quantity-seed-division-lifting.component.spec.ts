import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedQuantitySeedDivisionLiftingComponent } from './allocated-quantity-seed-division-lifting.component';

describe('AllocatedQuantitySeedDivisionLiftingComponent', () => {
  let component: AllocatedQuantitySeedDivisionLiftingComponent;
  let fixture: ComponentFixture<AllocatedQuantitySeedDivisionLiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedQuantitySeedDivisionLiftingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedQuantitySeedDivisionLiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
