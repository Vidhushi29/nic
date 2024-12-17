import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationOfBreederOfCertificatComponent } from './generation-of-breeder-of-certificat.component';

describe('GenerationOfBreederOfCertificatComponent', () => {
  let component: GenerationOfBreederOfCertificatComponent;
  let fixture: ComponentFixture<GenerationOfBreederOfCertificatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerationOfBreederOfCertificatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationOfBreederOfCertificatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
