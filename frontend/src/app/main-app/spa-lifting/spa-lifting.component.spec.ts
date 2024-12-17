import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaLiftingComponent } from './spa-lifting.component';

describe('SpaLiftingComponent', () => {
  let component: SpaLiftingComponent;
  let fixture: ComponentFixture<SpaLiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaLiftingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaLiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
