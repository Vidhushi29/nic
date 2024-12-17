import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederProductionDashboardComponent } from './breeder-production-dashboard.component';

describe('BreederProductionDashboardComponent', () => {
  let component: BreederProductionDashboardComponent;
  let fixture: ComponentFixture<BreederProductionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederProductionDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederProductionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
