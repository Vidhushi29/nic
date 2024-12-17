import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedTestingLabaratoryListComponent } from './seed-testing-labaratory-list.component';

describe('SeedTestingLabaratoryListComponent', () => {
  let component: SeedTestingLabaratoryListComponent;
  let fixture: ComponentFixture<SeedTestingLabaratoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedTestingLabaratoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedTestingLabaratoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
