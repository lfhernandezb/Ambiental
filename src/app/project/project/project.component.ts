import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertModule } from 'src/app/alert/alert.module';
import { AlertComponent } from 'src/app/alert/alert/alert.component';
import { NewFindingComponent } from 'src/app/dialogs/new-finding/new-finding.component';
import { NewProjectComponent } from 'src/app/dialogs/new-project/new-project.component';
import { PaginationConfig } from 'src/app/helpers/pagination-config';
import { Company } from 'src/app/interfaces/company';
import { Finding } from 'src/app/interfaces/finding';
import { Project } from 'src/app/interfaces/project';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyService } from 'src/app/services/company.service';
import { FindingService } from 'src/app/services/finding.service';
import { ProjectService } from 'src/app/services/project.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-project',
    standalone: true,
    templateUrl: './project.component.html',
    styleUrl: './project.component.css',
    imports: [
      AlertModule,
      NgxPaginationModule,
      NgxSpinnerModule,
      NgFor
    ]
})
export class ProjectComponent {
  options: any;
  // arreglo de itemes en pantalla
  collection: any;
  // arreglo con todas las urls retornadas por el servicio
  findingList: any;
  criteria: string;
  success: boolean;
  errorMessage: string;
  pagConfig: PaginationConfig;
  backendUrl: any;
  companyId: any;
  projectId: any;
  company: Company = {} as Company;
  project: Project = {} as Project;

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
    this.criteria = '';
    this.success = false;
    this.errorMessage = '';
    this.pagConfig = new PaginationConfig();
  }

  ngOnInit(): void {
    console.log('Project OnInit');
    this.sessionService.retrieve();
    // truco: en typescript/javascript las variables basicas no se pueden pasar como referencia
    // por lo que se crea un objeto cuyo contenido es el string que queremos modificar
    let objCriteria = {str: this.criteria};
    let objCompanyId = {str: this.companyId};
    let objProjectId = {str: this.projectId};
    this.sessionService.getProjectConfig(this.pagConfig, objCriteria, objCompanyId, objProjectId);
    this.pagConfig.itemsPerPage = environment.itemsPerPage;
    this.pagConfig.autoHide = environment.autoHide;
    this.criteria = objCriteria.str;

    //this.sessionService.setCompanyConfig(this.pagConfig, this.criteria);

    // esta pagina podria estarse armando desde el boton 'back' en company-detail
    // strCurrentPage: string;
    // this.backendCompany = environment.apiUrl;

    console.log("isAuthenticated: " + this.authenticationService.isAuthenticated());

    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    //let strCurrentPage = this.route.snapshot.paramMap.get('currentPage') as string;

    let bMustCallLoadFindings: Boolean = false;

    if (this.pagConfig.currentPage > 0) {
      // venimos desde proyecto (boton back) o recargamos la pagina.... generamos los datos
      // el signo + convierte de string a numero

      bMustCallLoadFindings = true;

      // obtengo el companyId y projectId desde la sesion
      this.companyId = objCompanyId.str;

      this.projectId = objProjectId.str;

      this.spinner.show('sp3');
    }
    else {
      // venimos desde company y debemos conseguir los detalles del project
      this.companyId = this.route.snapshot.paramMap.get('companyId');

      this.projectId = this.route.snapshot.paramMap.get('projectId');

      if (environment.autoloadListings) {
        bMustCallLoadFindings = true;
      }

    }

    // this.sessionService.setCompanyConfig(this.pagConfig, this.criteria, this.companyId);

    this.getCompany();

    this.getProject();

    if (bMustCallLoadFindings) {
      this.getFindingList();
    }


    // para mensajes de error
    this.options = {
      autoclose: false,
      keepAfterRouteChange: false
    };

  }

  pageChange(newPage: number) {
    this.pagConfig.currentPage = newPage;
    // eliminamos mensaje de error si estuviera desplegado
    this.alertService.clear();

    this.collection = this.findingList.slice(
      this.pagConfig.itemsPerPage * (newPage - 1),
      this.pagConfig.itemsPerPage * (newPage - 1) + this.pagConfig.itemsPerPage);

    this.sessionService.setProjectConfig(this.pagConfig, this.criteria, this.companyId, this.projectId);
    this.sessionService.save();
  }

  onSearch(criteria: string) {
    //alert("You Clicked Me!");
    // console.log("onSearch")
    this.success = true;
    //this.sessionService.getSession().homeCriteria = criteria;
    this.pagConfig.numberOfPages = 0;
    this.pagConfig.totalItems = 0;
    this.pagConfig.currentPage = 0;
    this.collection = [];
    this.pagConfig.itemsPerPage = environment.itemsPerPage;
    this.pagConfig.autoHide = true;

    this.criteria = criteria;
    // eliminamos mensaje de error si estuviera desplegado
    this.alertService.clear();

    /** spinner starts */
    this.spinner.show('sp3');

    this.getFindingList();
  }

  onNew() {
    // console.log("onNew")

    this.openModal()

  }

  openModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 260;
    dialogConfig.width = "600px";
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
        company: this.company,
        project: this.project
    }

    const dialogRef = this.dialog.open(NewFindingComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        // console.log('ok: '+result.url+' '+result.organization+' '+result.negocio+' '+result.area+' '+result.algorithm)

        // [routerLink]="['/project', url.descripcion, {currentPage: pagConfig.currentPage, numberOfPages: pagConfig.numberOfPages, totalItems: pagConfig.totalItems, criteria: seek.value}]"

        this.goToFindingDetail(result.findingId);
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

  // vamos al detalle del project para la URL si existe la carpeta
  // sino mostramos advertencia
  detail(findingId: string) {
    //let project: any = null;
    this.goToFindingDetail(findingId);
    /*
     this.router.navigate(['/project', url, formFileName, path, {
      currentPage: this.pagConfig.currentPage,
      numberOfPages: this.pagConfig.numberOfPages,
      totalItems: this.pagConfig.totalItems,
      criteria: this.criteria}]);
    */
    /*
    this.projectService.getProject(url, fileName)
    .subscribe(
      data => {
        //this.config = data // success path

        this.router.navigate(['/project', url, fileName, {
          currentPage: this.pagConfig.currentPage,
          numberOfPages: this.pagConfig.numberOfPages,
          totalItems: this.pagConfig.totalItems,
          criteria: this.criteria}]);
      },
      error => {
        //this.error = error // error path
        console.log('error:' + error)
        alert(error)
      }
    );
    */
  }

  public onReport() {
    this.router.navigate(['/report', {
      projectId: this.projectId,
      companyName: this.company.name,
      projectDescription: this.project.description
    }]);
  }

  // bajar el project
  download(path: string, formFileName: string) {
/*     // let project: Project = null;

    this.projectService.downloadProject(path, formFileName)
    .subscribe(
      (response: any) => {

        //let blob = new Blob([response.body], { type: "application/octet-stream" });
        //console.log('headers:')
        const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
        const fileName = response.headers.get('Content-Disposition').split(';')[1].split('=')[1].replace(/\"/g, ''); //response.headers.get('content-disposition').split(';')[0];
        //let url = window.URL.createObjectURL(blob).split(':')[1];
        let url = window.URL.createObjectURL(blob);
        // console.log('content-type: '+response.headers.get('content-type'))
        // console.log('url: '+url)

        let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }

      },
      error => {
        //this.error = error // error path
        // console.log('error:' + error)
        alert(error)
      }
    );
 */
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

  private getFindingList(): void {
    // limpiamos variables de sesion
    this.sessionService.resetProjectSessionData();
    this.sessionService.resetFindingSessionData();

    this.findingService.
    getByDescriptionContainingAndProjectId(this.criteria, this.projectId).
    subscribe(
      (data)=>{
        console.log(data);
        this.findingList = data as Finding[];
        this.pagConfig.totalItems = this.findingList.length;


        if (this.pagConfig.totalItems > 0) {
            let paginationData = Number(this.pagConfig.totalItems / this.pagConfig.itemsPerPage);
            this.pagConfig.numberOfPages = Number(paginationData.toFixed());

            if (paginationData > this.pagConfig.numberOfPages) {
              this.pagConfig.numberOfPages += 1;
            }
        }

        // si this.pagConfig.currentPage > 0 venimos desde otra pagina o se recargo... vamos a la pagina donde estabamos
        if (this.pagConfig.currentPage == 0) {
          // hicimos busqueda con boton
          this.pagConfig.currentPage = 1;
        }

        this.pageChange(this.pagConfig.currentPage);

        this.spinner.hide('sp3');

        this.sessionService.setProjectConfig(this.pagConfig, this.criteria, this.companyId, this.projectId)
        this.sessionService.save();

      },
      (error) => {
        console.log('oops', error);
        this.success = false;
        if (error.status == 404) {
          this.alertService.info('No se encontraron registros', this.options);
        }
        else {
          // this.errorMessage = error;
          // console.log("triggering error");
          this.alertService.error(error.message, this.options);
        }

        this.spinner.hide('sp3');
      }

    );
  }

  private goToFindingDetail(findingId: string) {

    this.router.navigate(['/finding', {
      companyId: this.companyId,
      projectId: this.projectId,
      findingId: findingId
    }]);
  }

}
