import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerReportComponent } from './nodal-officer-report.component';

describe('NodalOfficerReportComponent', () => {
  let component: NodalOfficerReportComponent;
  let fixture: ComponentFixture<NodalOfficerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodalOfficerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalOfficerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
