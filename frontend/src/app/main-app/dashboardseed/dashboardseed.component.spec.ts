import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardseedComponent } from './dashboardseed.component';

describe('DashboardseedComponent', () => {
  let component: DashboardseedComponent;
  let fixture: ComponentFixture<DashboardseedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardseedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardseedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
