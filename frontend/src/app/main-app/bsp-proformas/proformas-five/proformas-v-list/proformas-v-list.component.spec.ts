import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformasVListComponent } from './proformas-v-list.component';

describe('ProformasVListComponent', () => {
  let component: ProformasVListComponent;
  let fixture: ComponentFixture<ProformasVListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformasVListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformasVListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
