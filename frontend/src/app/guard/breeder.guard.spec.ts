import { TestBed } from '@angular/core/testing';

import { BreederGuard } from './breeder.guard';

describe('BreederGuard', () => {
  let guard: BreederGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BreederGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
