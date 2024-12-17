import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIvListComponent } from './proformas-iv-list.component';

describe('ProformasIvListComponent', () => {
  let component: ProformasIvListComponent;
  let fixture: ComponentFixture<ProformasIvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIvListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
