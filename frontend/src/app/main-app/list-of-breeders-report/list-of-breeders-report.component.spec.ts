import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfBreedersReportComponent } from './list-of-breeders-report.component';

describe('ListOfBreedersReportComponent', () => {
  let component: ListOfBreedersReportComponent;
  let fixture: ComponentFixture<ListOfBreedersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfBreedersReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfBreedersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
