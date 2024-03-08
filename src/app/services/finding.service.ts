import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Finding } from '../interfaces/finding';

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
export class FindingService {
  constructor(private httpClient: HttpClient) { }

  public getByFindingId(findingId: string): Observable<Finding> {
  	//argument: string = 'criteria=';
    if (!findingId) {
      findingId = '';
    }
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.get<Finding>(environment.apiUrl+'/api/findings/'+findingId, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }

  public getByIdentifierAndProjectId(identifier: string, projectId: string): Observable<Finding[]> {
  	//argument: string = 'criteria=';
    if (!identifier) {
      identifier = '';
    }
    // console.log('environment.apiFinding: '+environment.apiFinding);
    return this.httpClient.get<Finding[]>(environment.apiUrl+'/api/findings/param?identifier='+identifier+'&projectId='+projectId, httpOptions); //get(environment.apiFinding+'/api/findings?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Finding[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiFinding+'/api/findings?criteria='+criteria, httpOptions);
  }

  public getByDescriptionContainingAndProjectId(description: string, projectId: string): Observable<Finding[]> {
  	//argument: string = 'criteria=';
    if (!description) {
      description = '';
    }
    // console.log('environment.apiFinding: '+environment.apiFinding);
    return this.httpClient.get<Finding[]>(environment.apiUrl+'/api/findings/special?description='+description+'&projectId='+projectId, httpOptions); //get(environment.apiFinding+'/api/findings?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Finding[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiFinding+'/api/findings?criteria='+criteria, httpOptions);
  }

  public existsFindingByDescriptionContainingAndProjectId(description: string, companyId: string): Observable<boolean> {

    this.getByDescriptionContainingAndProjectId(description, companyId).
      subscribe(
        (data)=>{
          console.log(data);
          let findingList = data as Finding[];

          if (findingList.length > 0) {
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

  public save(finding: Finding): Observable<Finding> {
  	//argument: string = 'criteria=';
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.post<Finding>(environment.apiUrl+'/api/findings/save', finding, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }

  public update(finding: Finding): Observable<Finding> {
  	//argument: string = 'criteria=';
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.put<Finding>(environment.apiUrl+'/api/findings/save', finding, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }

}
