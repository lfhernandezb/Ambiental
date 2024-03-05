import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';
import { AlertService } from '../../services/alert.service';
import { PaginationConfig } from '../../helpers/pagination-config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewCompanyComponent } from '../../dialogs/new-company/new-company.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertModule } from 'src/app/alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertComponent } from 'src/app/alert/alert/alert.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    AlertModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgFor
  ]
})
export class HomeComponent implements OnInit {

  options: any;
  // arreglo de itemes en pantalla
  collection: any;
  // arreglo con todas las companys retornadas por el servicio
  companyList: any;
  criteria: string;
  success: boolean;
  errorMessage: string;
  pagConfig: PaginationConfig;
  backendCompany: any;

  constructor(
    private authenticationService: AuthenticationService,
    private companyService: CompanyService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog ) {
    this.criteria = '';
    this.success = false;
    this.errorMessage = '';
    this.pagConfig = new PaginationConfig()
  }

  ngOnInit(): void {

    // el signo + convierte de string a numero
    // el signo ! pasa de un string | null a string
    // conf propia
    this.pagConfig.currentPage = +this.route.snapshot.paramMap.get('homeCurrentPage')!;
    this.pagConfig.itemsPerPage = +this.route.snapshot.paramMap.get('homeItemsPerPage')!;
    this.pagConfig.numberOfPages = +this.route.snapshot.paramMap.get('homeNumberOfPages')!;
    this.pagConfig.totalItems = +this.route.snapshot.paramMap.get('homeTotalItems')!;
    this.pagConfig.criteria = this.route.snapshot.paramMap.get('homeCriteria')!;

    this.criteria = this.route.snapshot.paramMap.get('homeCriteria')!;

    // para paginacion
    // this.pagConfig = new PaginationConfig();
    this.pagConfig.itemsPerPage = 5;
    this.pagConfig.autoHide = true;
    // esta pagina podria estarse armando desde el boton 'back' en company-detail
    // strCurrentPage: string;
    this.backendCompany = environment.apiUrl;

    console.log("isAuthenticated: " + this.authenticationService.isAuthenticated());

    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    //let strCurrentPage = this.route.snapshot.paramMap.get('currentPage') as string;

    if (this.pagConfig.currentPage > 0) {
      // venimos desde proyecto (boton back).... generamos los datos
      // el signo + convierte de string a numero
      //this.pagConfig.currentPage = +strCurrentPage;
      // this.pagConfig.itemsPerPage = 10;
      //this.pagConfig.numberOfPages = +(this.route.snapshot.paramMap.get('numberOfPages') as string);
      //this.pagConfig.totalItems = +(this.route.snapshot.paramMap.get('totalItems') as string);
      // this.pagConfig.autoHide = true;
      //this.criteria = this.route.snapshot.paramMap.get('criteria') as string;

      //this.criteria = this.pagConfig.criteria;

      this.spinner.show('sp3');

      this.getCompanyList(this.criteria);
      /*
      this.companyService.
        listCompanies(this.criteria).
        subscribe(
          (data)=>{
          console.log(data);
          this.companyList = data as Company[];
          this.pagConfig.totalItems = this.companyList.length;

		      if (this.pagConfig.totalItems == 0) {
		        this.alertService.info('No records found');
		      }

		      // console.log(this.pagConfig);
		      this.pageChange(this.pagConfig.currentPage);

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

    this.collection = this.companyList.slice(this.pagConfig.itemsPerPage * (newPage - 1), this.pagConfig.itemsPerPage * (newPage - 1) + this.pagConfig.itemsPerPage);

    // console.log(this.collection);
    // console.log(this.companyList);
	  /*
    this.companyService.
      listCompanies(this.pagConfig.itemsPerPage * (newPage - 1), this.pagConfig.itemsPerPage, this.criteria).
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

    this.getCompanyList(this.criteria);
    /*
    this.companyService.
      listCompanies(this.criteria).
      subscribe(
        (data)=>{
          console.log(data);
          this.companyList = data as Company[];
          this.pagConfig.totalItems = this.companyList.length;

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
        (error: HttpErrorResponse) => {
          console.log('oops', error.message);
          this.success = false;
          if (error.status == 404) {
            this.errorMessage = "No se encontaron registros";
          }
          else {
            this.errorMessage = error.message;
          }
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
        modalTitle: 'Nueva Empresa',
        modalMessage: 'Mensaje'
    };
    dialogConfig.minWidth = 600;

    const dialogRef = this.dialog.open(NewCompanyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        // console.log('ok: '+result.company+' '+result.organization+' '+result.negocio+' '+result.area+' '+result.algorithm)

        // [routerLink]="['/formulario', company.descripcion, {currentPage: pagConfig.currentPage, numberOfPages: pagConfig.numberOfPages, totalItems: pagConfig.totalItems, criteria: seek.value}]"
        /*
        this.router.navigate(['/formulario', {
        currentPage: this.pagConfig.currentPage,
        numberOfPages: this.pagConfig.numberOfPages,
        totalItems: this.pagConfig.totalItems,
        criteria: this.criteria,
        newCompany: result.company,
        organization: result.organization,
        negocio: result.negocio,
        area: result.area,
        algorithm: result.algorithm }]);
        */

        this.goToCompanyDetail(result.companyId);

        /*
        this.router.navigate(['/company', {
          companyId: result.companyId,
          homeCurrentPage: this.pagConfig.currentPage,
          homeItemsPerPage: this.pagConfig.itemsPerPage,
          homeNumberOfPages: this.pagConfig.numberOfPages,
          homeTotalItems: this.pagConfig.totalItems,
          homeCriteria: this.criteria
        }]);
        */
      }
    });
  }

  // vamos al detalle del formulario para la URL si existe la carpeta
  // sino mostramos advertencia
  detail(companyId: string) {

    /*
    pasamos parametros al componente de proyectos... el companyId para que busque
    los proyectos asociados, y el criterio de busqueda y en que pagina estamos para restaurar
    esta pagina cuando el usuario haga "volver"
     */
    this.goToCompanyDetail(companyId);
    /*
    this.router.navigate(['/company', {
      companyId: companyId,
      homeCurrentPage: this.pagConfig.currentPage,
      homeItemsPerPage: this.pagConfig.itemsPerPage,
      homeNumberOfPages: this.pagConfig.numberOfPages,
      homeTotalItems: this.pagConfig.totalItems,
      homeCriteria: this.criteria}]);
    */

  }

  // bajar el formulario
  download(path: string, formFileName: string) {
/*     // let formulario: Formulario = null;

    this.formularioService.downloadFormulario(path, formFileName)
    .subscribe(
      (response: any) => {

        //let blob = new Blob([response.body], { type: "application/octet-stream" });
        //console.log('headers:')
        const blob = new Blob([response.body], { type: response.headers.get('Content-Type') });
        const fileName = response.headers.get('Content-Disposition').split(';')[1].split('=')[1].replace(/\"/g, ''); //response.headers.get('content-disposition').split(';')[0];
        //let company = window.URL.createObjectURL(blob).split(':')[1];
        let company = window.URL.createObjectURL(blob);
        // console.log('content-type: '+response.headers.get('content-type'))
        // console.log('company: '+company)

        let pwa = window.open(company);
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

  private getCompanyList(criteria: string): void {
    this.companyService.
    listCompanies(this.criteria).
    subscribe(
      (data)=>{
        console.log(data);
        this.companyList = data as Company[];
        this.pagConfig.totalItems = this.companyList.length;


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
        console.log('oops', error);
        this.success = false;
        this.errorMessage = error;
        // console.log("triggering error");
        this.alertService.error(this.errorMessage, this.options);

        this.spinner.hide('sp3');
      }

    );

  }

  private goToCompanyDetail(companyId: string) {

    this.router.navigate(['/company', {
      companyId: companyId,
      homeCurrentPage: this.pagConfig.currentPage,
      homeItemsPerPage: this.pagConfig.itemsPerPage,
      homeNumberOfPages: this.pagConfig.numberOfPages,
      homeTotalItems: this.pagConfig.totalItems,
      homeCriteria: this.criteria}]);

  }
}
