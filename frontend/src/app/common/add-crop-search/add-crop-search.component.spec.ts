import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropSearchComponent } from './add-crop-search.component';

describe('AddCropSearchComponent', () => {
  let component: AddCropSearchComponent;
  let fixture: ComponentFixture<AddCropSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
