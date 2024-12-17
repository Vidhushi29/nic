import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreederSeedsComponent } from './add-breeder-seeds.component';

describe('AddBreederSeedsComponent', () => {
  let component: AddBreederSeedsComponent;
  let fixture: ComponentFixture<AddBreederSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreederSeedsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBreederSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
