import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardingLetterComponent } from './forwarding-letter.component';

describe('ForwardingLetterComponent', () => {
  let component: ForwardingLetterComponent;
  let fixture: ComponentFixture<ForwardingLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardingLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardingLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
