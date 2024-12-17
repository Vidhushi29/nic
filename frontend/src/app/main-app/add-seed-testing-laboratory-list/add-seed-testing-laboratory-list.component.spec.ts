import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeedTestingLaboratoryListComponent } from './add-seed-testing-laboratory-list.component';

describe('AddSeedTestingLaboratoryListComponent', () => {
  let component: AddSeedTestingLaboratoryListComponent;
  let fixture: ComponentFixture<AddSeedTestingLaboratoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeedTestingLaboratoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeedTestingLaboratoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
