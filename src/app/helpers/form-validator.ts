import { AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { Observable, map, of } from "rxjs";
import { CompanyService } from "../services/company.service";
import { Company } from "../interfaces/company";
import { ProjectService } from "../services/project.service";
import { Injector } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";

export function existsCompanyByNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      let injector = Injector.create([ { provide: [CompanyService, HttpClient], useClass:CompanyService, deps: [HttpClientModule]}])
      let companyService = injector.get(CompanyService);
      return companyService.getByName(control.value).pipe(map(
        (comps: Company[]) => {
          return (comps && comps.length > 0 && comps[0].name == control.value) ? { "existsCompany": true } : null;
        }
      ));
    };
}
/*
export function existsProjectValidator(projectService: ProjectService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return projectService.listProjects(control.value, companyId).pipe(map(
      (projs: Project[]) => {
        return (projs && projs.length > 0 && projs[0].description == control.value) ? { "existsProject": true } : null;
      }
    ));
  };
}
*/
