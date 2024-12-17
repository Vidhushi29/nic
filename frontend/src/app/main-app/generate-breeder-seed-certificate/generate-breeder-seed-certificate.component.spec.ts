import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBreederSeedCertificateComponent } from './generate-breeder-seed-certificate.component';

describe('GenerateBreederSeedCertificateComponent', () => {
  let component: GenerateBreederSeedCertificateComponent;
  let fixture: ComponentFixture<GenerateBreederSeedCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBreederSeedCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBreederSeedCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
