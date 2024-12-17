import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIListComponent } from './proformas-i-list.component';

describe('ProformasIListComponent', () => {
  let component: ProformasIListComponent;
  let fixture: ComponentFixture<ProformasIListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
