import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndentorComponent } from './add-indentor.component';

describe('AddIndentorComponent', () => {
  let component: AddIndentorComponent;
  let fixture: ComponentFixture<AddIndentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIndentorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
