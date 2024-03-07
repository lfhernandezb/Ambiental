import { TestBed } from '@angular/core/testing';

import { FindingValidatorService } from './finding-validator.service';

describe('FindingValidatorService', () => {
  let service: FindingValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindingValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
