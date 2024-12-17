import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreederSpaFormsComponent } from './allocation-breeder-spa-forms.component';

describe('AllocationBreederSpaFormsComponent', () => {
  let component: AllocationBreederSpaFormsComponent;
  let fixture: ComponentFixture<AllocationBreederSpaFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationBreederSpaFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreederSpaFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
