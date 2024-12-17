import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedCertificateComponent } from './breeder-seed-certificate.component';

describe('BreederSeedCertificateComponent', () => {
  let component: BreederSeedCertificateComponent;
  let fixture: ComponentFixture<BreederSeedCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
