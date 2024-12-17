import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsptworeportComponent } from './bsptworeport.component';

describe('BsptworeportComponent', () => {
  let component: BsptworeportComponent;
  let fixture: ComponentFixture<BsptworeportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsptworeportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsptworeportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
