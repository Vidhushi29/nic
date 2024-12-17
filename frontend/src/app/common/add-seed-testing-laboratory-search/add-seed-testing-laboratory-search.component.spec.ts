import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeedTestingLaboratorySearchComponent } from './add-seed-testing-laboratory-search.component';

describe('AddSeedTestingLaboratorySearchComponent', () => {
  let component: AddSeedTestingLaboratorySearchComponent;
  let fixture: ComponentFixture<AddSeedTestingLaboratorySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeedTestingLaboratorySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeedTestingLaboratorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
