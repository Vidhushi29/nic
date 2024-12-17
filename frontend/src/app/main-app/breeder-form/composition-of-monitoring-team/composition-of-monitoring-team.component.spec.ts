import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionOfMonitoringTeamComponent } from './composition-of-monitoring-team.component';

describe('CompositionOfMonitoringTeamComponent', () => {
  let component: CompositionOfMonitoringTeamComponent;
  let fixture: ComponentFixture<CompositionOfMonitoringTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompositionOfMonitoringTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionOfMonitoringTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
