import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityOfBreederseedComponent } from './availability-of-breederseed.component';

describe('AvailabilityOfBreederseedComponent', () => {
  let component: AvailabilityOfBreederseedComponent;
  let fixture: ComponentFixture<AvailabilityOfBreederseedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityOfBreederseedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityOfBreederseedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
