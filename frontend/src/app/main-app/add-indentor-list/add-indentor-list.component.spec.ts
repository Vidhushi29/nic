import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndentorListComponent } from './add-indentor-list.component';

describe('AddIndentorListComponent', () => {
  let component: AddIndentorListComponent;
  let fixture: ComponentFixture<AddIndentorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIndentorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndentorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
