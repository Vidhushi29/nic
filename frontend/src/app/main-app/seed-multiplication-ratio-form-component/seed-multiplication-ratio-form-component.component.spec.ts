import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedMultiplicationRatioFormComponentComponent } from './seed-multiplication-ratio-form-component.component';

describe('SeedMultiplicationRatioFormComponentComponent', () => {
  let component: SeedMultiplicationRatioFormComponentComponent;
  let fixture: ComponentFixture<SeedMultiplicationRatioFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedMultiplicationRatioFormComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedMultiplicationRatioFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
