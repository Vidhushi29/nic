import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasVbFormComponent } from './proformas-vb-form.component';

describe('ProformasVbFormComponent', () => {
  let component: ProformasVbFormComponent;
  let fixture: ComponentFixture<ProformasVbFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasVbFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasVbFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
