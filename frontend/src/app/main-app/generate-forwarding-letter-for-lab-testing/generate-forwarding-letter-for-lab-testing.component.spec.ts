import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateForwardingLetterForLabTestingComponent } from './generate-forwarding-letter-for-lab-testing.component';

describe('GenerateForwardingLetterForLabTestingComponent', () => {
  let component: GenerateForwardingLetterForLabTestingComponent;
  let fixture: ComponentFixture<GenerateForwardingLetterForLabTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateForwardingLetterForLabTestingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateForwardingLetterForLabTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
