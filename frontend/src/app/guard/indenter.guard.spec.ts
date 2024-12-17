import { TestBed } from '@angular/core/testing';

import { IndenterGuard } from './indenter.guard';

describe('IndenterGuard', () => {
  let guard: IndenterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IndenterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
