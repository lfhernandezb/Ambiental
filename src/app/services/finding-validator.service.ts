import { Injectable } from '@angular/core';
import { FindingService } from './finding.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Finding } from '../interfaces/finding';

@Injectable({
  providedIn: 'root'
})
export class FindingValidatorService {
  constructor(private findingService: FindingService) {

  }

  public checkFindingByIdentifierAndProjectId(projectId: string): any {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.findingService.getByIdentifierAndProjectId(control.value, projectId).pipe(map(
        (finds: Finding[]) => {
          return (finds && finds.length > 0 && finds[0].identifier == control.value) ? { "existsFinding": true } : null;
        }
      ));
    };
  }
}

