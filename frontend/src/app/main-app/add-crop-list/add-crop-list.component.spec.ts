import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropListComponent } from './add-crop-list.component';

describe('AddCropListComponent', () => {
  let component: AddCropListComponent;
  let fixture: ComponentFixture<AddCropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
