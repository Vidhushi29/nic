import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfIndentorsReportComponent } from './list-of-indentors-report.component';

describe('ListOfIndentorsReportComponent', () => {
  let component: ListOfIndentorsReportComponent;
  let fixture: ComponentFixture<ListOfIndentorsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfIndentorsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfIndentorsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
