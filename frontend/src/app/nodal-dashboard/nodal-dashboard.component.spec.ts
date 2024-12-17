import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalDashboardComponent } from './nodal-dashboard.component';

describe('NodalDashboardComponent', () => {
  let component: NodalDashboardComponent;
  let fixture: ComponentFixture<NodalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodalDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
