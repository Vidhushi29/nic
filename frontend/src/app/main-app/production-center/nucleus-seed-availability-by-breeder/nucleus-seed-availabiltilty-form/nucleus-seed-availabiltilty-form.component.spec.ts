import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleusSeedAvailabiltiltyFormComponent } from './nucleus-seed-availabiltilty-form.component';

describe('NucleusSeedAvailabiltiltyFormComponent', () => {
  let component: NucleusSeedAvailabiltiltyFormComponent;
  let fixture: ComponentFixture<NucleusSeedAvailabiltiltyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NucleusSeedAvailabiltiltyFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NucleusSeedAvailabiltiltyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
