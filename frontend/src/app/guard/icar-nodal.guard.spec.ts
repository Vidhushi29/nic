import { TestBed } from '@angular/core/testing';

import { IcarNodalGuard } from './icar-nodal.guard';

describe('IcarNodalGuard', () => {
  let guard: IcarNodalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IcarNodalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
