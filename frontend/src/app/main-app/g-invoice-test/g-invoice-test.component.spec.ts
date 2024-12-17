import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GInvoiceTestComponent } from './g-invoice-test.component';

describe('GInvoiceTestComponent', () => {
  let component: GInvoiceTestComponent;
  let fixture: ComponentFixture<GInvoiceTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GInvoiceTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GInvoiceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
