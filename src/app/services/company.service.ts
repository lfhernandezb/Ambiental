import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, TimeoutError, of } from 'rxjs';
import { Company } from '../interfaces/company';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Content-Security-Policy': 'default-src ' + environment.apiUrl + '/;'
  }),
  observe: 'body' as const
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  public getByCompanyId(companyId: string): Observable<Company> {
  	//argument: string = 'criteria=';
    if (!companyId) {
      companyId = '';
    }
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.get<Company>(environment.apiUrl+'/api/companies/'+companyId, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }


  public getByName(criteria: string): Observable<Company[]> {
  	//argument: string = 'criteria=';
    if (!criteria) {
      criteria = '';
    }
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/param?name='+criteria, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }

  public existsByName(company: string): Observable<boolean> {

    this.getByName(company).
      subscribe(
        (data)=>{
          console.log(data);
          let companyList = data as Company[];

          if (companyList.length > 0) {
            return true;
          }
          else {
              return false;
          }

        },
        (error) => {
          console.log('oops', error);
          //return null;
        }
    );
    return of(false);
  }

  public save(company: Company): Observable<Company> {
  	//argument: string = 'criteria=';
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.post<Company>(environment.apiUrl+'/api/companies/save', company, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }
}
