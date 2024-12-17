import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotMonitoringTeamDetailsComponent } from './got-monitoring-team-details.component';

describe('GotMonitoringTeamDetailsComponent', () => {
  let component: GotMonitoringTeamDetailsComponent;
  let fixture: ComponentFixture<GotMonitoringTeamDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GotMonitoringTeamDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GotMonitoringTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
