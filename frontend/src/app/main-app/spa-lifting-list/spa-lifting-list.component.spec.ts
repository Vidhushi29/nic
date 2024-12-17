import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaLiftingListComponent } from './spa-lifting-list.component';

describe('SpaLiftingListComponent', () => {
  let component: SpaLiftingListComponent;
  let fixture: ComponentFixture<SpaLiftingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaLiftingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaLiftingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
