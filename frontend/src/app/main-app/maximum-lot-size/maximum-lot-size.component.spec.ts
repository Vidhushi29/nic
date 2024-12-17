import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumLotSizeComponent } from './maximum-lot-size.component';

describe('MaximumLotSizeComponent', () => {
  let component: MaximumLotSizeComponent;
  let fixture: ComponentFixture<MaximumLotSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumLotSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximumLotSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
