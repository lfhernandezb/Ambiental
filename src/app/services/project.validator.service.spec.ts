import { TestBed } from '@angular/core/testing';

import { Project.ValidatorService } from './project.validator.service';

describe('Project.ValidatorService', () => {
  let service: Project.ValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Project.ValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
