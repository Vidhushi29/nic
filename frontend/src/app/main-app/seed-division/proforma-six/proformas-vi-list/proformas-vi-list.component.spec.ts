import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasViListComponent } from './proformas-vi-list.component';

describe('ProformasViListComponent', () => {
  let component: ProformasViListComponent;
  let fixture: ComponentFixture<ProformasViListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasViListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasViListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
