import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleusSeedAvailabilityByBreederSearchComponent } from './nucleus-seed-availability-by-breeder-search.component';

describe('NucleusSeedAvailabilityByBreederSearchComponent', () => {
  let component: NucleusSeedAvailabilityByBreederSearchComponent;
  let fixture: ComponentFixture<NucleusSeedAvailabilityByBreederSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NucleusSeedAvailabilityByBreederSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NucleusSeedAvailabilityByBreederSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
