import { TestBed } from '@angular/core/testing';

import { SeedDivisionService } from './seed-division.service';

describe('SeedDivisionService', () => {
  let service: SeedDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeedDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
