import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotNumberListComponent } from './lot-number-list.component';

describe('LotNumberListComponent', () => {
  let component: LotNumberListComponent;
  let fixture: ComponentFixture<LotNumberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotNumberListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
