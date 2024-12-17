import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIiListComponent } from './proformas-ii-list.component';

describe('ProformasIiListComponent', () => {
  let component: ProformasIiListComponent;
  let fixture: ComponentFixture<ProformasIiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
