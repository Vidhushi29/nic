import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederCropListComponent } from './add-breeder-crop-list.component';

describe('AddBreederCropListComponent', () => {
  let component: AddBreederCropListComponent;
  let fixture: ComponentFixture<AddBreederCropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederCropListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederCropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
