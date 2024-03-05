import { TestBed } from '@angular/core/testing';

import { CompanyValidatorService } from './company.validator.service';

describe('CompanyValidatorService', () => {
  let service: CompanyValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
