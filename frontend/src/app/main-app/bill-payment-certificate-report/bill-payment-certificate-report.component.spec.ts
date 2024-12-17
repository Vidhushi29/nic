import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPaymentCertificateReportComponent } from './bill-payment-certificate-report.component';

describe('BillPaymentCertificateReportComponent', () => {
  let component: BillPaymentCertificateReportComponent;
  let fixture: ComponentFixture<BillPaymentCertificateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillPaymentCertificateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPaymentCertificateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
