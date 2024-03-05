import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../interfaces/project';

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
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  public getByProjectId(projectId: string): Observable<Project> {
  	//argument: string = 'criteria=';
    if (!projectId) {
      projectId = '';
    }
    // console.log('environment.apiCompany: '+environment.apiCompany);
    return this.httpClient.get<Project>(environment.apiUrl+'/api/projects/'+projectId, httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Company[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiCompany+'/api/companys?criteria='+criteria, httpOptions);
  }

  public listProjects(criteria: string, companyId: string): Observable<Project[]> {
  	//argument: string = 'criteria=';
    if (!criteria) {
      criteria = '';
    }
    // console.log('environment.apiProject: '+environment.apiProject);
    return this.httpClient.get<Project[]>(environment.apiUrl+'/api/projects/param?description='+criteria+'&companyId='+companyId, httpOptions); //get(environment.apiProject+'/api/projects?criteria='+criteria, httpOptions);
    //return this.httpClient.get<Project[]>(environment.apiUrl+'/api/companies/all', httpOptions); //get(environment.apiProject+'/api/projects?criteria='+criteria, httpOptions);
  }

  public existsProject(description: string, companyId: string): Observable<boolean> {

    this.listProjects(description, companyId).
      subscribe(
        (data)=>{
          console.log(data);
          let projectList = data as Project[];

          if (projectList.length > 0) {
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
}
