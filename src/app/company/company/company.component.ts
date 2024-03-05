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
  homePagConfig: PaginationConfig;
  backendUrl: any;
  companyId: any;

  constructor(
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
    this.homePagConfig = new PaginationConfig();
  }

  ngOnInit(): void {

    this.companyId = this.route.snapshot.paramMap.get('companyId');

    // conf home
    this.homePagConfig.currentPage = +this.route.snapshot.paramMap.get('homeCurrentPage')!;
    this.homePagConfig.itemsPerPage = +this.route.snapshot.paramMap.get('homeItemsPerPage')!;
    this.homePagConfig.numberOfPages = +this.route.snapshot.paramMap.get('homeNumberOfPages')!;
    this.homePagConfig.totalItems = +this.route.snapshot.paramMap.get('homeTotalItems')!;
    this.homePagConfig.criteria = this.route.snapshot.paramMap.get('homeCriteria')!;

    // conf propia
    this.pagConfig.currentPage = +this.route.snapshot.paramMap.get('companyCurrentPage')!;
    this.pagConfig.itemsPerPage = +this.route.snapshot.paramMap.get('companyItemsPerPage')!;
    this.pagConfig.numberOfPages = +this.route.snapshot.paramMap.get('companyNumberOfPages')!;
    this.pagConfig.totalItems = +this.route.snapshot.paramMap.get('companyTotalItems')!;
    this.pagConfig.criteria = this.route.snapshot.paramMap.get('companyCriteria')!;

    this.criteria = this.route.snapshot.paramMap.get('companyCriteria')!;


    // para paginacion
    // this.pagConfig = new PaginationConfig();
    this.pagConfig.itemsPerPage = 5;
    this.pagConfig.autoHide = true;
    // esta pagina podria estarse armando desde el boton 'back' en url-detail
    // strCurrentPage: string;
    this.backendUrl = environment.apiUrl;

    // parametros recibidos desde home component
    /*
      this.router.navigate(['/projects', companyId, {
      currentPage: this.pagConfig.currentPage,
      numberOfPages: this.pagConfig.numberOfPages,
      totalItems: this.pagConfig.totalItems,
      criteria: this.criteria}]);

    */
    /*
    this.homePagConfig.currentPage = +(this.route.snapshot.paramMap.get('currentPage') as string);
    this.homePagConfig.numberOfPages = +(this.route.snapshot.paramMap.get('numberOfPages') as string);
    this.homePagConfig.totalItems = +(this.route.snapshot.paramMap.get('totalItems') as string);
    this.homePagConfig = this.route.snapshot.paramMap.get('criteria') as string;
    */
    // se recibe como parametro companyId desde company component
    // si no, se solicita crear un nuevo project
    //this.companyId = this.route.snapshot.paramMap.get('companyId');

    this.getCompany();
    /*
    this.companyService.getByCompanyId(this.companyId).
    subscribe(
      (data)=>{
      // console.log(data);
      this.company = data as Company;
      this.pagConfig.totalItems = this.projectList.length;

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
  */



    //let strCurrentPage = this.route.snapshot.paramMap.get('currentPage') as string;

    if (this.pagConfig.currentPage > 0) {
      // venimos desde finding (boton back).... generamos los datos
      // el signo + convierte de string a numero
      //this.pagConfig.currentPage = +strCurrentPage;
      // this.pagConfig.itemsPerPage = 10;
      this.pagConfig.numberOfPages = +(this.route.snapshot.paramMap.get('numberOfPages') as string);
      this.pagConfig.totalItems = +(this.route.snapshot.paramMap.get('totalItems') as string);
      // this.pagConfig.autoHide = true;
      this.criteria = this.route.snapshot.paramMap.get('criteria') as string;

      this.spinner.show('sp3');

      this.getProjectList();
      /*
      this.projectService.listProjects(this.criteria, this.companyId).
        subscribe(
          (data)=>{
          // console.log(data);
          this.projectList = data as Project[];
          this.pagConfig.totalItems = this.projectList.length;

		      if (this.pagConfig.totalItems == 0) {
		        this.alertService.info('No records found');
		      }

		      // console.log(this.pagConfig);
		      this.pageChange(this.pagConfig.currentPage);

          this.spinner.hide('sp3');

        },
        (error) => {
          // console.log('oops', error);
          this.success = false;
          this.errorMessage = error;
          // console.log("triggering error");
          this.alertService.error(this.errorMessage, this.options);

          this.spinner.hide('sp3');
        }

      );
      */

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

    this.collection = this.projectList.slice(this.pagConfig.itemsPerPage * (newPage - 1), this.pagConfig.itemsPerPage * (newPage - 1) + this.pagConfig.itemsPerPage);

    // console.log(this.collection);
    // console.log(this.urlList);
	  /*
    this.urlService.
      listUrls(this.pagConfig.itemsPerPage * (newPage - 1), this.pagConfig.itemsPerPage, this.criteria).
      subscribe(
        (data)=>{
          //console.log(data);
          this.collection = data;
        },
        (error) => {
          console.log('oops', error);
          this.success = false;
          this.errorMessage = error;
          console.log("triggering error");
          this.alertService.error(this.errorMessage, this.options);
        }
    );
    */
  }

  onSearch(criteria: string) {
    //alert("You Clicked Me!");
    // console.log("onSearch")
    this.success = true;
    this.criteria = criteria;
    this.pagConfig.numberOfPages = 0;
    this.pagConfig.totalItems = 0;
    this.pagConfig.currentPage = 0;
    this.collection = [];

    // eliminamos mensaje de error si estuviera desplegado
    this.alertService.clear();

    /** spinner starts */
    this.spinner.show('sp3');
    /*
    setTimeout(() => {
      // spinner ends after 5 seconds
      this.spinner.hide('sp3');
    }, 3000);
    */

    this.getProjectList();
    /*
    this.projectService.
      listProjects(this.criteria, this.companyId).
      subscribe(
        (data)=>{
          //console.log(data);
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

          // console.log(this.pagConfig);
          this.pageChange(1);

          this.spinner.hide('sp3');

        },
        (error) => {
          // console.log('oops', error);
          this.success = false;
          this.errorMessage = error;
          // console.log("triggering error");
          this.alertService.error(this.errorMessage, this.options);

          this.spinner.hide('sp3');
        }
    );
    */

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

        // console.log('ok: '+result.url+' '+result.organization+' '+result.negocio+' '+result.area+' '+result.algorithm)

        // [routerLink]="['/project', url.descripcion, {currentPage: pagConfig.currentPage, numberOfPages: pagConfig.numberOfPages, totalItems: pagConfig.totalItems, criteria: seek.value}]"

        this.goToProjectDetail(result.projectId);
        /*
        this.router.navigate(['/project', {
          companyId: this.companyId,
          projectId: result.projectId,

          // conf propia
          companyCurrentPage: this.pagConfig.currentPage,
          companyNumberOfPages: this.pagConfig.numberOfPages,
          companyItemsPerPage: this.pagConfig.itemsPerPage,
          companyTotalItems: this.pagConfig.totalItems,
          companyCriteria: this.pagConfig.criteria,

          // conf home
          homeCurrentPage: this.homePagConfig.currentPage,
          homeNumberOfPages: this.homePagConfig.numberOfPages,
          homeItemsPerPage: this.homePagConfig.itemsPerPage,
          homeTotalItems: this.homePagConfig.totalItems,
          homeCriteria: this.homePagConfig.criteria,

        }]);
        */
      }
    }
  )}

  // vamos al detalle del project
  detail(projectId: string) {
    //let project: any = null;
    this.goToProjectDetail(projectId);
    /*
    this.router.navigate(['/project', {

      companyId: this.companyId,
      projectId: projectId,

      // conf propia
      companyCurrentPage: this.pagConfig.currentPage,
      companyNumberOfPages: this.pagConfig.numberOfPages,
      companyItemsPerPage: this.pagConfig.itemsPerPage,
      companyTotalItems: this.pagConfig.totalItems,
      companyCriteria: this.pagConfig.criteria,

      // conf home
      homeCurrentPage: this.homePagConfig.currentPage,
      homeNumberOfPages: this.homePagConfig.numberOfPages,
      homeItemsPerPage: this.homePagConfig.itemsPerPage,
      homeTotalItems: this.homePagConfig.totalItems,
      homeCriteria: this.homePagConfig.criteria
    }])
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

  this.projectService.listProjects(this.criteria, this.companyId).
    subscribe(
      (data)=>{
      // console.log(data);
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

      this.pagConfig.currentPage = 1;

      this.pageChange(this.pagConfig.currentPage);

      this.spinner.hide('sp3');

    },
    (error) => {
      // console.log('oops', error);
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
      projectId: projectId,

      // conf propia
      companyCurrentPage: this.pagConfig.currentPage,
      companyNumberOfPages: this.pagConfig.numberOfPages,
      companyItemsPerPage: this.pagConfig.itemsPerPage,
      companyTotalItems: this.pagConfig.totalItems,
      companyCriteria: this.pagConfig.criteria,

      // conf home
      homeCurrentPage: this.homePagConfig.currentPage,
      homeNumberOfPages: this.homePagConfig.numberOfPages,
      homeItemsPerPage: this.homePagConfig.itemsPerPage,
      homeTotalItems: this.homePagConfig.totalItems,
      homeCriteria: this.homePagConfig.criteria
    }]);
  }
}
