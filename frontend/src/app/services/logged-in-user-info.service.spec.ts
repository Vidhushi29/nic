import { TestBed } from '@angular/core/testing';

import { LoggedInUserInfoService } from './logged-in-user-info.service';

describe('LoggedInUserInfoService', () => {
  let service: LoggedInUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedInUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
