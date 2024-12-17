import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropNotifiedListComponent } from './add-crop-notified-list.component';

describe('AddCropNotifiedListComponent', () => {
  let component: AddCropNotifiedListComponent;
  let fixture: ComponentFixture<AddCropNotifiedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropNotifiedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropNotifiedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
