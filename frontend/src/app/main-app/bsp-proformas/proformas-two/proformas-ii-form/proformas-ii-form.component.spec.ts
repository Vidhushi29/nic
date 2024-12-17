import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIiFormComponent } from './proformas-ii-form.component';

describe('ProformasIiFormComponent', () => {
  let component: ProformasIiFormComponent;
  let fixture: ComponentFixture<ProformasIiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIiFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
