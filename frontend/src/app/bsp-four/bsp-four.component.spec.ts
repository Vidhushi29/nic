import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspFourComponent } from './bsp-four.component';

describe('BspFourComponent', () => {
  let component: BspFourComponent;
  let fixture: ComponentFixture<BspFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspFourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
