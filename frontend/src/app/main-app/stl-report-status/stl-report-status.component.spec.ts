import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StlReportStatusComponent } from './stl-report-status.component';

describe('StlReportStatusComponent', () => {
  let component: StlReportStatusComponent;
  let fixture: ComponentFixture<StlReportStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StlReportStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StlReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
