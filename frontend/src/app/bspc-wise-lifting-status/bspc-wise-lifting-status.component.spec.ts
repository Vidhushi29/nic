import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspcWiseLiftingStatusComponent } from './bspc-wise-lifting-status.component';

describe('BspcWiseLiftingStatusComponent', () => {
  let component: BspcWiseLiftingStatusComponent;
  let fixture: ComponentFixture<BspcWiseLiftingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspcWiseLiftingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspcWiseLiftingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
