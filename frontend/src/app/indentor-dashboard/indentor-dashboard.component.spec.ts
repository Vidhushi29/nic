import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentorDashboardComponent } from './indentor-dashboard.component';

describe('IndentorDashboardComponent', () => {
  let component: IndentorDashboardComponent;
  let fixture: ComponentFixture<IndentorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndentorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
