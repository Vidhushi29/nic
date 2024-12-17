import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederListComponent } from './add-breeder-list.component';

describe('AddBreederListComponent', () => {
  let component: AddBreederListComponent;
  let fixture: ComponentFixture<AddBreederListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
