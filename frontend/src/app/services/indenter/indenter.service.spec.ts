import { TestBed } from '@angular/core/testing';

import { IndenterService } from './indenter.service';

describe('IndenterService', () => {
  let service: IndenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
