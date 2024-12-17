import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspcWiseAssignCropComponent } from './bspc-wise-assign-crop.component';

describe('BspcWiseAssignCropComponent', () => {
  let component: BspcWiseAssignCropComponent;
  let fixture: ComponentFixture<BspcWiseAssignCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspcWiseAssignCropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspcWiseAssignCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
