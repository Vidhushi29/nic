import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederProductionCenterComponent } from './add-breeder-production-center.component';

describe('AddBreederProductionCenterComponent', () => {
  let component: AddBreederProductionCenterComponent;
  let fixture: ComponentFixture<AddBreederProductionCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederProductionCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederProductionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
