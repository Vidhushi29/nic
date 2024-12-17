import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfBreederSeedProductionCenterReportComponent } from './list-of-breeder-seed-production-center-report.component';

describe('ListOfBreederSeedProductionCenterReportComponent', () => {
  let component: ListOfBreederSeedProductionCenterReportComponent;
  let fixture: ComponentFixture<ListOfBreederSeedProductionCenterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfBreederSeedProductionCenterReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfBreederSeedProductionCenterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
