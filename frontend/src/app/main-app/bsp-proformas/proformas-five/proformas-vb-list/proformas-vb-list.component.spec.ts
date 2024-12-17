import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasVbListComponent } from './proformas-vb-list.component';

describe('ProformasVbListComponent', () => {
  let component: ProformasVbListComponent;
  let fixture: ComponentFixture<ProformasVbListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasVbListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasVbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
