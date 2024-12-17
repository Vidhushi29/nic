import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDetailReportComponent } from './plant-detail-report.component';

describe('PlantDetailReportComponent', () => {
  let component: PlantDetailReportComponent;
  let fixture: ComponentFixture<PlantDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantDetailReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
