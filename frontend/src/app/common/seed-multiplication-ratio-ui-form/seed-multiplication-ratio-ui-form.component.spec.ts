import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedMultiplicationRatioUiFormComponent } from './seed-multiplication-ratio-ui-form.component';

describe('SeedMultiplicationRatioUiFormComponent', () => {
  let component: SeedMultiplicationRatioUiFormComponent;
  let fixture: ComponentFixture<SeedMultiplicationRatioUiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedMultiplicationRatioUiFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedMultiplicationRatioUiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
