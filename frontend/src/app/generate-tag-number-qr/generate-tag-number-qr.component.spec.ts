import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTagNumberQrComponent } from './generate-tag-number-qr.component';

describe('GenerateTagNumberQrComponent', () => {
  let component: GenerateTagNumberQrComponent;
  let fixture: ComponentFixture<GenerateTagNumberQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTagNumberQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateTagNumberQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
