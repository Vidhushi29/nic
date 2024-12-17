import { TestBed } from '@angular/core/testing';

import { SeedServiceService } from './seed-service.service';

describe('SeedServiceService', () => {
  let service: SeedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
