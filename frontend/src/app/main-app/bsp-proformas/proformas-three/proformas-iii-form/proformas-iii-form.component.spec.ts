import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIiiFormComponent } from './proformas-iii-form.component';

describe('ProformasIiiFormComponent', () => {
  let component: ProformasIiiFormComponent;
  let fixture: ComponentFixture<ProformasIiiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIiiFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIiiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
