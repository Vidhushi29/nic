import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationOfLabelNumberBreederComponent } from './creation-of-label-number-breeder.component';

describe('CreationOfLabelNumberBreederComponent', () => {
  let component: CreationOfLabelNumberBreederComponent;
  let fixture: ComponentFixture<CreationOfLabelNumberBreederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationOfLabelNumberBreederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationOfLabelNumberBreederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
