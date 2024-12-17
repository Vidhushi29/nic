import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftingOfBreederSeedComponent } from './lifting-of-breeder-seed.component';

describe('LiftingOfBreederSeedComponent', () => {
  let component: LiftingOfBreederSeedComponent;
  let fixture: ComponentFixture<LiftingOfBreederSeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiftingOfBreederSeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiftingOfBreederSeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
