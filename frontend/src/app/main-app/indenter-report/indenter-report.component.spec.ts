import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndenterReportComponent } from './indenter-report.component';

describe('IndenterReportComponent', () => {
  let component: IndenterReportComponent;
  let fixture: ComponentFixture<IndenterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndenterReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndenterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
