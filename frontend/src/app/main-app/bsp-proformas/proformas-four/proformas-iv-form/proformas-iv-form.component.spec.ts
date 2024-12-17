import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIvFormComponent } from './proformas-iv-form.component';

describe('ProformasIvFormComponent', () => {
  let component: ProformasIvFormComponent;
  let fixture: ComponentFixture<ProformasIvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIvFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
