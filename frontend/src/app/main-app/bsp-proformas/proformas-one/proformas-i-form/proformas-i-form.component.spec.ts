import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIFormComponent } from './proformas-i-form.component';

describe('ProformasIFormComponent', () => {
  let component: ProformasIFormComponent;
  let fixture: ComponentFixture<ProformasIFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
