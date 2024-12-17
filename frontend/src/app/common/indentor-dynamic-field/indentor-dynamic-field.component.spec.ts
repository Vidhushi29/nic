import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentorDynamicFieldComponent } from './indentor-dynamic-field.component';

describe('IndentorDynamicFieldComponent', () => {
  let component: IndentorDynamicFieldComponent;
  let fixture: ComponentFixture<IndentorDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentorDynamicFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentorDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
