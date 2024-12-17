import { TestBed } from '@angular/core/testing';

import { ProductionCenterGuard } from './production-center.guard';

describe('ProductionCenterGuard', () => {
  let guard: ProductionCenterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProductionCenterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
