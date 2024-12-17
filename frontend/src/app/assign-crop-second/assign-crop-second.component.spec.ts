import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCropSecondComponent } from './assign-crop-second.component';

describe('AssignCropSecondComponent', () => {
  let component: AssignCropSecondComponent;
  let fixture: ComponentFixture<AssignCropSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCropSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCropSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
