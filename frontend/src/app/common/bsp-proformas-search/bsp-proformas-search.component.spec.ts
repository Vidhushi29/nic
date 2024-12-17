import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspProformasSearchComponent } from './bsp-proformas-search.component';

describe('BspProformasSearchComponent', () => {
  let component: BspProformasSearchComponent;
  let fixture: ComponentFixture<BspProformasSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspProformasSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspProformasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
