import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCoordinatorReportComponent } from './project-coordinator-report.component';

describe('ProjectCoordinatorReportComponent', () => {
  let component: ProjectCoordinatorReportComponent;
  let fixture: ComponentFixture<ProjectCoordinatorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCoordinatorReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCoordinatorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
