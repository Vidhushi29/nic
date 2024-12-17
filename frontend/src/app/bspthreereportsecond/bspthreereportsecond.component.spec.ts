import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspthreereportsecondComponent } from './bspthreereportsecond.component';

describe('BspthreereportsecondComponent', () => {
  let component: BspthreereportsecondComponent;
  let fixture: ComponentFixture<BspthreereportsecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspthreereportsecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspthreereportsecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
