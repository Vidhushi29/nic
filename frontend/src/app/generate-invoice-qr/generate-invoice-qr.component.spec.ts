import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInvoiceQrComponent } from './generate-invoice-qr.component';

describe('GenerateInvoiceQrComponent', () => {
  let component: GenerateInvoiceQrComponent;
  let fixture: ComponentFixture<GenerateInvoiceQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateInvoiceQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateInvoiceQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
