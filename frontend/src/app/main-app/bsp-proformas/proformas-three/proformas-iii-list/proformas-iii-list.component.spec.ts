import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasIiiListComponent } from './proformas-iii-list.component';

describe('ProformasIiiListComponent', () => {
  let component: ProformasIiiListComponent;
  let fixture: ComponentFixture<ProformasIiiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasIiiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasIiiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
