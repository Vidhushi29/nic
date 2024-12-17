import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCardQrComponent } from './generate-card-qr.component';

describe('GenerateCardQrComponent', () => {
  let component: GenerateCardQrComponent;
  let fixture: ComponentFixture<GenerateCardQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCardQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCardQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
