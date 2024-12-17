import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentorSpaComponent } from './indentor-spa.component';

describe('IndentorSpaComponent', () => {
  let component: IndentorSpaComponent;
  let fixture: ComponentFixture<IndentorSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentorSpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentorSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
