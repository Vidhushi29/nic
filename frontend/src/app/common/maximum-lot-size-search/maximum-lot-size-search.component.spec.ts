import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumLotSizeSearchComponent } from './maximum-lot-size-search.component';

describe('MaximumLotSizeSearchComponent', () => {
  let component: MaximumLotSizeSearchComponent;
  let fixture: ComponentFixture<MaximumLotSizeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumLotSizeSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaximumLotSizeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
