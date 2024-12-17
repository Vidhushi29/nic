import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseStatusComponent } from './crop-wise-status.component';

describe('CropWiseStatusComponent', () => {
  let component: CropWiseStatusComponent;
  let fixture: ComponentFixture<CropWiseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
