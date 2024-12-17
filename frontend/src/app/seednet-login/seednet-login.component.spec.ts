import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeednetLoginComponent } from './seednet-login.component';

describe('LoginComponent', () => {
  let component: SeednetLoginComponent;
  let fixture: ComponentFixture<SeednetLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeednetLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeednetLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
