import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaWiseStatusLiftingNonOfBreederSeedComponent } from './spa-wise-status-lifting-non-of-breeder-seed.component';

describe('SpaWiseStatusLiftingNonOfBreederSeedComponent', () => {
  let component: SpaWiseStatusLiftingNonOfBreederSeedComponent;
  let fixture: ComponentFixture<SpaWiseStatusLiftingNonOfBreederSeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaWiseStatusLiftingNonOfBreederSeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaWiseStatusLiftingNonOfBreederSeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
