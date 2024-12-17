import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNodalSecondComponent } from './dashboard-nodal-second.component';

describe('DashboardNodalSecondComponent', () => {
  let component: DashboardNodalSecondComponent;
  let fixture: ComponentFixture<DashboardNodalSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardNodalSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNodalSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
