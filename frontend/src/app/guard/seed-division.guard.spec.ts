import { TestBed } from '@angular/core/testing';

import { SeedDivisionGuard } from './seed-division.guard';

describe('SeedDivisionGuard', () => {
  let guard: SeedDivisionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SeedDivisionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
