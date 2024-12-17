import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SppDashboardSecondComponent } from './spp-dashboard-second.component';

describe('SppDashboardSecondComponent', () => {
  let component: SppDashboardSecondComponent;
  let fixture: ComponentFixture<SppDashboardSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SppDashboardSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SppDashboardSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
