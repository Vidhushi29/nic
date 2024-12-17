import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantListComponent } from './add-plant-list.component';

describe('AddPlantListComponent', () => {
  let component: AddPlantListComponent;
  let fixture: ComponentFixture<AddPlantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlantListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
