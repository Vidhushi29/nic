import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfIndentReportComponent } from './list-of-indent-report.component';

describe('ListOfIndentReportComponent', () => {
  let component: ListOfIndentReportComponent;
  let fixture: ComponentFixture<ListOfIndentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfIndentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfIndentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
