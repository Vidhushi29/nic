import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedLabelNumbersComponent } from './generated-label-numbers.component';

describe('GeneratedLabelNumbersComponent', () => {
  let component: GeneratedLabelNumbersComponent;
  let fixture: ComponentFixture<GeneratedLabelNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedLabelNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedLabelNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
