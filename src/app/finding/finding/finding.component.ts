import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertModule } from 'src/app/alert/alert.module';
import { AlertComponent } from 'src/app/alert/alert/alert.component';
import { NewProjectComponent } from 'src/app/dialogs/new-project/new-project.component';
import { Company } from 'src/app/interfaces/company';
import { Finding } from 'src/app/interfaces/finding';
import { Project } from 'src/app/interfaces/project';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyService } from 'src/app/services/company.service';
import { FindingService } from 'src/app/services/finding.service';
import { ProjectService } from 'src/app/services/project.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-finding',
  standalone: true,
  templateUrl: './finding.component.html',
  styleUrl: './finding.component.css',
  imports: [
    AlertModule,
    NgxSpinnerModule
  ],
})
export class FindingComponent {
  options: any;
  success: boolean;
  errorMessage: string;
  backendUrl: any;
  companyId: any;
  projectId: any;
  findingId: any;
  company: Company = {} as Company;
  project: Project = {} as Project;
  finding: Finding = {} as Finding;

  constructor(
    private sessionService: SessionService,
    private authenticationService: AuthenticationService,
    private projectService: ProjectService,
    private companyService: CompanyService,
    private findingService: FindingService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog ) {
    this.success = false;
    this.errorMessage = '';
  }

  ngOnInit(): void {
    console.log('Finding OnInit');
    this.sessionService.retrieve();
    // truco: en typescript/javascript las variables basicas no se pueden pasar como referencia
    // por lo que se crea un objeto cuyo contenido es el string que queremos modificar
    let objCompanyId = {str: this.companyId};
    let objProjectId = {str: this.projectId};
    let objFindingtId = {str: this.findingId};
    this.sessionService.getFindingConfig(objCompanyId, objProjectId, objFindingtId);

    //this.sessionService.setCompanyConfig(this.pagConfig, this.criteria);

    // esta pagina podria estarse armando desde el boton 'back' en company-detail
    // strCurrentPage: string;
    // this.backendCompany = environment.apiUrl;

    console.log("isAuthenticated: " + this.authenticationService.isAuthenticated());

    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    //let strCurrentPage = this.route.snapshot.paramMap.get('currentPage') as string;

    // venimos desde project y debemos conseguir los detalles del finding
    this.companyId = this.route.snapshot.paramMap.get('companyId');

    this.projectId = this.route.snapshot.paramMap.get('projectId');

    this.findingId = this.route.snapshot.paramMap.get('findingId');

    this.sessionService.setFindingConfig(this.companyId, this.projectId, this.findingId);

    this.getCompany();

    this.getProject();

    this.getFinding();

    // para mensajes de error
    this.options = {
      autoclose: false,
      keepAfterRouteChange: false
    };

  }

  openModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
    };
    dialogConfig.minWidth = 600;

    const dialogRef = this.dialog.open(NewProjectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        // console.log('ok: '+result.url+' '+result.organization+' '+result.negocio+' '+result.area+' '+result.algorithm)

        // [routerLink]="['/project', url.descripcion, {currentPage: pagConfig.currentPage, numberOfPages: pagConfig.numberOfPages, totalItems: pagConfig.totalItems, criteria: seek.value}]"

        //this.goToFindingDetail(result.findingId);
        /*
        this.router.navigate(['/project', {
          currentPage: this.pagConfig.currentPage,
          numberOfPages: this.pagConfig.numberOfPages,
          totalItems: this.pagConfig.totalItems,
          criteria: this.criteria,
          newUrl: result.url,
          organization: result.organization,
          negocio: result.negocio,
          area: result.area,
          algorithm: result.algorithm }]);
        */
      }
    });
  }

  private getCompany() {

    this.companyService.getByCompanyId(this.companyId).
      subscribe(
        (data)=>{
        // console.log(data);
        this.company = data as Company;
        //this.pagConfig.totalItems = this.projectList.length;

        this.spinner.hide('sp3');

      },
      (error) => {
        console.log('oops', error);
        this.success = false;
        this.errorMessage = error;
        // console.log("triggering error");
        this.alertService.error(this.errorMessage, this.options);

        this.spinner.hide('sp3');
      }

    );
  }

  private getProject() {

    this.projectService.getByProjectId(this.projectId).
      subscribe(
        (data)=>{
        // console.log(data);
        this.project = data as Project;
        //this.pagConfig.totalItems = this.projectList.length;

        this.spinner.hide('sp3');

      },
      (error) => {
        console.log('oops', error);
        this.success = false;
        this.errorMessage = error;
        // console.log("triggering error");
        this.alertService.error(this.errorMessage, this.options);

        this.spinner.hide('sp3');
      }

    );
  }

  private getFinding() {

    this.findingService.getByFindingId(this.findingId).
      subscribe(
        (data)=>{
        // console.log(data);
        this.finding = data as Finding;
        //this.pagConfig.totalItems = this.projectList.length;

        this.spinner.hide('sp3');

      },
      (error) => {
        console.log('oops', error);
        this.success = false;
        this.errorMessage = error;
        // console.log("triggering error");
        this.alertService.error(this.errorMessage, this.options);

        this.spinner.hide('sp3');
      }

    );
  }

  public editDescription() {

  }

  public editAddress() {

  }

  public editComment() {

  }

  public editImage() {

  }

  public editStatus() {

  }
}
