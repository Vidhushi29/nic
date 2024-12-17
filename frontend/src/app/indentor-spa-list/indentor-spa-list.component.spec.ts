import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentorSpaListComponent } from './indentor-spa-list.component';

describe('IndentorSpaListComponent', () => {
  let component: IndentorSpaListComponent;
  let fixture: ComponentFixture<IndentorSpaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentorSpaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentorSpaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
