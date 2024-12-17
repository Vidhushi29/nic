import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InabilityReallocateFormComponent } from './inability-reallocate-form.component';

describe('InabilityReallocateFormComponent', () => {
  let component: InabilityReallocateFormComponent;
  let fixture: ComponentFixture<InabilityReallocateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InabilityReallocateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InabilityReallocateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
