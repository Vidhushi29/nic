import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDivisionReportsecondComponent } from './seed-division-reportsecond.component';

describe('SeedDivisionReportsecondComponent', () => {
  let component: SeedDivisionReportsecondComponent;
  let fixture: ComponentFixture<SeedDivisionReportsecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedDivisionReportsecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedDivisionReportsecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
