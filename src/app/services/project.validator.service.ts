import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectValidatorService {
  constructor(private projectService: ProjectService) {

  }

  public checkProjectDescription(companyId: string): any {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.projectService.getByDescriptionAndCompanyId(control.value, companyId).pipe(map(
        (projs: Project[]) => {
          return (projs && projs.length > 0 && projs[0].description == control.value) ? { "existsProject": true } : null;
        }
      ));
    };
  }
  /*
  public checkProjectAddress(): any {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.projectService.(control.value).pipe(map(
        (projs: Project[]) => {
          return (projs && projs.length > 0 && projs[0].description == control.value) ? { "existsCProject": true } : null;
        }
      ));
    };
  }
  */
}
