import { TestBed } from '@angular/core/testing';

import { FindingStateService } from './finding-state.service';

describe('FindingStateService', () => {
  let service: FindingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
