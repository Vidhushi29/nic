import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedCertificateDownloadComponent } from './breeder-seed-certificate-download.component';

describe('BreederSeedCertificateDownloadComponent', () => {
  let component: BreederSeedCertificateDownloadComponent;
  let fixture: ComponentFixture<BreederSeedCertificateDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedCertificateDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedCertificateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
