import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowOutTestReportBspvComponent } from './grow-out-test-report-bspv.component';

describe('GrowOutTestReportBspvComponent', () => {
  let component: GrowOutTestReportBspvComponent;
  let fixture: ComponentFixture<GrowOutTestReportBspvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowOutTestReportBspvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowOutTestReportBspvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
