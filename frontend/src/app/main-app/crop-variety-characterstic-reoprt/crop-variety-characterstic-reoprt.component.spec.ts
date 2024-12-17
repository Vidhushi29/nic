import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropVarietyCharactersticReoprtComponent } from './crop-variety-characterstic-reoprt.component';

describe('CropVarietyCharactersticReoprtComponent', () => {
  let component: CropVarietyCharactersticReoprtComponent;
  let fixture: ComponentFixture<CropVarietyCharactersticReoprtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropVarietyCharactersticReoprtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropVarietyCharactersticReoprtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
