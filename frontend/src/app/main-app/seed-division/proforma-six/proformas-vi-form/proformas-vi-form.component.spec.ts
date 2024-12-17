import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasViFormComponent } from './proformas-vi-form.component';

describe('ProformasViFormComponent', () => {
  let component: ProformasViFormComponent;
  let fixture: ComponentFixture<ProformasViFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasViFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasViFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
