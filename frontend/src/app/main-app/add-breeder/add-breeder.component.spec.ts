import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederComponent } from './add-breeder.component';

describe('AddBreederComponent', () => {
  let component: AddBreederComponent;
  let fixture: ComponentFixture<AddBreederComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
