import { Injectable } from '@angular/core';
import { CompanyService } from './company.service';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Company } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyValidatorService {

  constructor(private companyService: CompanyService) {

  }

  checkCompany(): any {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.companyService.listCompanies(control.value).pipe(map(
        (comps: Company[]) => {
          return (comps && comps.length > 0 && comps[0].name == control.value) ? { "existsCompany": true } : null;
        }
      ));
    };

    /*
    return this.companyService.listCompanies(control.value).pipe(map(
      (comps: Company[]) => {
        return (comps && comps.length > 0 && comps[0].name == name) ? { "existsCompany": true } : null;
      }
    ));
    */
  }
}
