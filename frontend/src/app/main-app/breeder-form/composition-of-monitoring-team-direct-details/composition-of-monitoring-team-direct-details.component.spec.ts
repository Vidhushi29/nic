import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionOfMonitoringTeamDirectDetailsComponent } from './composition-of-monitoring-team-direct-details.component';

describe('CompositionOfMonitoringTeamDirectDetailsComponent', () => {
  let component: CompositionOfMonitoringTeamDirectDetailsComponent;
  let fixture: ComponentFixture<CompositionOfMonitoringTeamDirectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompositionOfMonitoringTeamDirectDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionOfMonitoringTeamDirectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
