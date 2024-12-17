import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCropVarietyCharactersticsComponent } from './add-crop-variety-characterstics.component';

describe('AddCropVarietyCharactersticsComponent', () => {
  let component: AddCropVarietyCharactersticsComponent;
  let fixture: ComponentFixture<AddCropVarietyCharactersticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCropVarietyCharactersticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCropVarietyCharactersticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
