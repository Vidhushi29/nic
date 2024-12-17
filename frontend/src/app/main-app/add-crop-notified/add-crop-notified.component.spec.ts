import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropNotifiedComponent } from './add-crop-notified.component';

describe('AddCropNotifiedComponent', () => {
  let component: AddCropNotifiedComponent;
  let fixture: ComponentFixture<AddCropNotifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropNotifiedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropNotifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
