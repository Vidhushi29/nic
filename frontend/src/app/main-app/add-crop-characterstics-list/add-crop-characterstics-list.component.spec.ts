import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropCharactersticsListComponent } from './add-crop-characterstics-list.component';

describe('AddCropCharactersticsListComponent', () => {
  let component: AddCropCharactersticsListComponent;
  let fixture: ComponentFixture<AddCropCharactersticsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropCharactersticsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropCharactersticsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
