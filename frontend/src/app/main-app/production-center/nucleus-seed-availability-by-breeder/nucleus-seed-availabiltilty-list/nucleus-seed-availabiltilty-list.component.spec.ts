import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleusSeedAvailabiltiltyListComponent } from './nucleus-seed-availabiltilty-list.component';

describe('NucleusSeedAvailabiltiltyListComponent', () => {
  let component: NucleusSeedAvailabiltiltyListComponent;
  let fixture: ComponentFixture<NucleusSeedAvailabiltiltyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NucleusSeedAvailabiltiltyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NucleusSeedAvailabiltiltyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
