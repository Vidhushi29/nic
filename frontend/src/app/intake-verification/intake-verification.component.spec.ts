import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeVerificationComponent } from './intake-verification.component';

describe('IntakeVerificationComponent', () => {
  let component: IntakeVerificationComponent;
  let fixture: ComponentFixture<IntakeVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
