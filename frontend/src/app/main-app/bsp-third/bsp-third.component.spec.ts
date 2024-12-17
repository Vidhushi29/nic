import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspThirdComponent } from './bsp-third.component';

describe('BspThirdComponent', () => {
  let component: BspThirdComponent;
  let fixture: ComponentFixture<BspThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspThirdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
