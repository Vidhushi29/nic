import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspOneSecondComponent } from './bsp-one-second.component';

describe('BspOneSecondComponent', () => {
  let component: BspOneSecondComponent;
  let fixture: ComponentFixture<BspOneSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspOneSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspOneSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
