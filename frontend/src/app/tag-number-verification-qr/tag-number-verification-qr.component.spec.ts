import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagNumberVerificationQrComponent } from './tag-number-verification-qr.component';

describe('TagNumberVerificationQrComponent', () => {
  let component: TagNumberVerificationQrComponent;
  let fixture: ComponentFixture<TagNumberVerificationQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagNumberVerificationQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagNumberVerificationQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
