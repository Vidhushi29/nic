import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumLotSizeListComponent } from './maximum-lot-size-list.component';

describe('MaximumLotSizeListComponent', () => {
  let component: MaximumLotSizeListComponent;
  let fixture: ComponentFixture<MaximumLotSizeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumLotSizeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximumLotSizeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
