import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederDashboardComponent } from './breeder-dashboard.component';

describe('BreederDashboardComponent', () => {
  let component: BreederDashboardComponent;
  let fixture: ComponentFixture<BreederDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
