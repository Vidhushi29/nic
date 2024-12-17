import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseAssignedComponent } from './crop-wise-assigned.component';

describe('CropWiseAssignedComponent', () => {
  let component: CropWiseAssignedComponent;
  let fixture: ComponentFixture<CropWiseAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseAssignedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
