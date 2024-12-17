import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspcWiseNucleusSeedComponent } from './bspc-wise-nucleus-seed.component';

describe('BspcWiseNucleusSeedComponent', () => {
  let component: BspcWiseNucleusSeedComponent;
  let fixture: ComponentFixture<BspcWiseNucleusSeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspcWiseNucleusSeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspcWiseNucleusSeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
