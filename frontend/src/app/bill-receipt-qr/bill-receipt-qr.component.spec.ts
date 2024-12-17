import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReceiptQrComponent } from './bill-receipt-qr.component';

describe('BillReceiptQrComponent', () => {
  let component: BillReceiptQrComponent;
  let fixture: ComponentFixture<BillReceiptQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillReceiptQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillReceiptQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
