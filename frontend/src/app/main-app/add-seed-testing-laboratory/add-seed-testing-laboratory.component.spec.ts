import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeedTestingLaboratoryComponent } from './add-seed-testing-laboratory.component';

describe('AddSeedTestingLaboratoryComponent', () => {
  let component: AddSeedTestingLaboratoryComponent;
  let fixture: ComponentFixture<AddSeedTestingLaboratoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeedTestingLaboratoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeedTestingLaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
