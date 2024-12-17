import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederProductionListComponent } from './add-breeder-production-list.component';

describe('AddBreederProductionListComponent', () => {
  let component: AddBreederProductionListComponent;
  let fixture: ComponentFixture<AddBreederProductionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederProductionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederProductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
