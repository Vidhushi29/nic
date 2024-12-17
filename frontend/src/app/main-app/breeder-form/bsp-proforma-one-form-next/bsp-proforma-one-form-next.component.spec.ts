import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspProformaOneFormNextComponent } from './bsp-proforma-one-form-next.component';

describe('BspProformaOneFormNextComponent', () => {
  let component: BspProformaOneFormNextComponent;
  let fixture: ComponentFixture<BspProformaOneFormNextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspProformaOneFormNextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspProformaOneFormNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
