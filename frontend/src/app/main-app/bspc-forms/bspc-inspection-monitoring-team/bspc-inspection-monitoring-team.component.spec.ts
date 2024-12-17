import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspcInspectionMonitoringTeamComponent } from './bspc-inspection-monitoring-team.component';

describe('BspcInspectionMonitoringTeamComponent', () => {
  let component: BspcInspectionMonitoringTeamComponent;
  let fixture: ComponentFixture<BspcInspectionMonitoringTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspcInspectionMonitoringTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspcInspectionMonitoringTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
