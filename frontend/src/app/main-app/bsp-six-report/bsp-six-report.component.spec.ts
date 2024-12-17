import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspSixReportComponent } from './bsp-six-report.component';

describe('BspSixReportComponent', () => {
  let component: BspSixReportComponent;
  let fixture: ComponentFixture<BspSixReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspSixReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspSixReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
