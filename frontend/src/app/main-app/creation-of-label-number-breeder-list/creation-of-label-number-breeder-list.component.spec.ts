import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationOfLabelNumberBreederListComponent } from './creation-of-label-number-breeder-list.component';

describe('CreationOfLabelNumberBreederListComponent', () => {
  let component: CreationOfLabelNumberBreederListComponent;
  let fixture: ComponentFixture<CreationOfLabelNumberBreederListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationOfLabelNumberBreederListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationOfLabelNumberBreederListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
