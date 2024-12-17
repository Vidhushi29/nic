import { TestBed } from '@angular/core/testing';

import { IcarService } from './icar.service';

describe('IcarService', () => {
  let service: IcarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
