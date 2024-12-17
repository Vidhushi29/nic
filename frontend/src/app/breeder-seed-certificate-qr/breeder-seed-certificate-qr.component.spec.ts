import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedCertificateQrComponent } from './breeder-seed-certificate-qr.component';

describe('BreederSeedCertificateQrComponent', () => {
  let component: BreederSeedCertificateQrComponent;
  let fixture: ComponentFixture<BreederSeedCertificateQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedCertificateQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedCertificateQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
