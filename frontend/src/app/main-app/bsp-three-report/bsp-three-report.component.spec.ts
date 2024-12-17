import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspThreeReportComponent } from './bsp-three-report.component';

describe('BspThreeReportComponent', () => {
  let component: BspThreeReportComponent;
  let fixture: ComponentFixture<BspThreeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspThreeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspThreeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
