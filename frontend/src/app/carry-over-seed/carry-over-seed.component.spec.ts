import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarryOverSeedComponent } from './carry-over-seed.component';

describe('CarryOverSeedComponent', () => {
  let component: CarryOverSeedComponent;
  let fixture: ComponentFixture<CarryOverSeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarryOverSeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarryOverSeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
