import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormNucleusSeedAvailabilityByBreederComponent } from './add-form-nucleus-seed-availability-by-breeder.component';

describe('AddFormNucleusSeedAvailabilityByBreederComponent', () => {
  let component: AddFormNucleusSeedAvailabilityByBreederComponent;
  let fixture: ComponentFixture<AddFormNucleusSeedAvailabilityByBreederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFormNucleusSeedAvailabilityByBreederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormNucleusSeedAvailabilityByBreederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
