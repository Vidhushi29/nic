import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDivisionComponent } from './seed-division.component';

describe('SeedDivisionComponent', () => {
  let component: SeedDivisionComponent;
  let fixture: ComponentFixture<SeedDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedDivisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
