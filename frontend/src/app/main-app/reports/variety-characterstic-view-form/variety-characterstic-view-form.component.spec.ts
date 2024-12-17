import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyCharactersticViewFormComponent } from './variety-characterstic-view-form.component';

describe('VarietyCharactersticViewFormComponent', () => {
  let component: VarietyCharactersticViewFormComponent;
  let fixture: ComponentFixture<VarietyCharactersticViewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyCharactersticViewFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyCharactersticViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
