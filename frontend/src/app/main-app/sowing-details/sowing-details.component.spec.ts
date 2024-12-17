import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowingDetailsComponent } from './sowing-details.component';

describe('SowingDetailsComponent', () => {
  let component: SowingDetailsComponent;
  let fixture: ComponentFixture<SowingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
