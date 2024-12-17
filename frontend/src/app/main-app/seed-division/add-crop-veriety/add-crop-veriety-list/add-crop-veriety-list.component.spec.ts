import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropVerietyListComponent } from './add-crop-veriety-list.component';

describe('AddCropVerietyListComponent', () => {
  let component: AddCropVerietyListComponent;
  let fixture: ComponentFixture<AddCropVerietyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropVerietyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropVerietyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
