import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasVFormComponent } from './proformas-v-form.component';

describe('ProformasVFormComponent', () => {
  let component: ProformasVFormComponent;
  let fixture: ComponentFixture<ProformasVFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasVFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasVFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
