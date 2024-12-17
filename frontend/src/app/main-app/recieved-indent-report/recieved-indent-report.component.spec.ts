import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievedIndentReportComponent } from './recieved-indent-report.component';

describe('RecievedIndentReportComponent', () => {
  let component: RecievedIndentReportComponent;
  let fixture: ComponentFixture<RecievedIndentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecievedIndentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecievedIndentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
