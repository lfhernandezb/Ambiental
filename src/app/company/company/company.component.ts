import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NewProjectComponent } from 'src/app/dialogs/new-project/new-project.component';
import { PaginationConfig } from 'src/app/helpers/pagination-config';
import { Company } from 'src/app/interfaces/company';
import { Project } from 'src/app/interfaces/project';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { ProjectService } from 'src/app/services/project.service';
import { environment } from 'src/environments/environment';
import { AlertModule } from 'src/app/alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';
import { SessionService } from 'src/app/services/session.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-project',
    standalone: true,
    templateUrl: './company.component.html',
    styleUrl: './company.component.css',
    imports: [
      AlertModule,
      NgxPaginationModule,
      NgxSpinnerModule,
      NgFor
    ]
})
export class CompanyComponent {
  company: Company = {} as any;
  options: any;
  // arreglo de itemes en pantalla
  collection: any;
  // arreglo con todas las urls retornadas por el servicio
  projectList: any;
  criteria: string;
  success: boolean;
  errorMessage: string;
  pagConfig: PaginationConfig;
  backendUrl: any;
  companyId: any;

  constructor(
    private sessionService: SessionService,
    private authenticationService: AuthenticationService,
    private projectService: ProjectService,
    private companyService: CompanyService,
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
    console.log('Company OnInit');
    this.sessionService.retrieve();
    // truco: en typescript/javascript las variables basicas no se pueden pasar como referencia
    // por lo que se crea un objeto cuyo contenido es el string que queremos modificar
    let obj = {str: this.criteria};
    let obj2 = {str: this.companyId};
    this.sessionService.getCompanyConfig(this.pagConfig, obj, obj2);
    this.criteria = obj.str;

    //this.sessionService.setCompanyConfig(this.pagConfig, this.criteria);

    // esta pagina podria estarse armando desde el boton 'back' en company-detail
    // strCurrentPage: string;
    // this.backendCompany = environment.apiUrl;

    console.log("isAuthenticated: " + this.authenticationService.isAuthenticated());

    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    //let strCurrentPage = this.route.snapshot.paramMap.get('currentPage') as string;

    if (this.pagConfig.currentPage > 0) {
      // venimos desde proyecto (boton back) o recargamos la pagina.... generamos los datos
      // el signo + convierte de string a numero

      this.companyId = obj2.str;

      this.spinner.show('sp3');

      this.getProjectList();
    }
    else {
      // venimos desde el home y debemos conseguir los detalles de la company
      this.companyId = this.route.snapshot.paramMap.get('companyId');
    }

    this.sessionService.setCompanyConfig(this.pagConfig, this.criteria, this.companyId);

    this.getCompany();

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

    this.collection = this.projectList.slice(
      this.pagConfig.itemsPerPage * (newPage - 1),
      this.pagConfig.itemsPerPage * (newPage - 1) + this.pagConfig.itemsPerPage);

    this.sessionService.setCompanyConfig(this.pagConfig, this.criteria, this.companyId);
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

    this.getProjectList();
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
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
    };
    dialogConfig.minWidth = 600;

    const dialogRef = this.dialog.open(NewProjectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        this.goToProjectDetail(result.projectId);
      }
    }
  )}

  // vamos al detalle del project
  detail(projectId: string) {
    //let project: any = null;
    this.goToProjectDetail(projectId);
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

  private getProjectList(): void {
    // limpiamos variables de sesion
    this.sessionService.resetCompanySessionData();
    this.sessionService.resetProjectSessionData();
    this.sessionService.resetFindingSessionData();

    this.projectService.
    listProjects(this.criteria, this.companyId).
    subscribe(
      (data)=>{
        console.log(data);
        this.projectList = data as Project[];
        this.pagConfig.totalItems = this.projectList.length;


        if (this.pagConfig.totalItems > 0) {
            let paginationData = Number(this.pagConfig.totalItems / this.pagConfig.itemsPerPage);
            this.pagConfig.numberOfPages = Number(paginationData.toFixed());

            if (paginationData > this.pagConfig.numberOfPages) {
              this.pagConfig.numberOfPages += 1;
            }
        }
        else {
            this.alertService.info('No records found');
        }

        // si this.pagConfig.currentPage > 0 venimos desde otra pagina o se recargo... vamos a la pagina donde estabamos
        if (this.pagConfig.currentPage == 0) {
          // hicimos busqueda con boton
          this.pagConfig.currentPage = 1;
        }

        this.pageChange(this.pagConfig.currentPage);

        this.spinner.hide('sp3');

        this.sessionService.setCompanyConfig(this.pagConfig, this.criteria, this.companyId)
        this.sessionService.save();

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

  private goToProjectDetail(projectId: string) {

    this.router.navigate(['/project', {
      companyId: this.companyId,
      projectId: projectId
    }]);
  }
}
