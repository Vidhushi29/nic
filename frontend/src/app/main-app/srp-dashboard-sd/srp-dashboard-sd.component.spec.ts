import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpDashboardSdComponent } from './srp-dashboard-sd.component';

describe('SrpDashboardSdComponent', () => {
  let component: SrpDashboardSdComponent;
  let fixture: ComponentFixture<SrpDashboardSdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpDashboardSdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpDashboardSdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
