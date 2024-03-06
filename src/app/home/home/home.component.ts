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
import { SessionService } from 'src/app/services/session.service';

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
    private sessionService: SessionService,
    private authenticationService: AuthenticationService,
    private companyService: CompanyService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog ) {
    this.success = false;
    this.errorMessage = '';
    this.pagConfig = new PaginationConfig(); //this.sessionService.getSession().homePaginationConfig;
    this.criteria = ''; //this.sessionService.getSession().homeCriteria;
  }

  ngOnInit(): void {
    console.log('Home OnInit');
    this.sessionService.retrieve();
    // truco: en typescript/javascript las variables basicas no se pueden pasar como referencia
    // por lo que se crea un objeto cuyo contenido es el string que queremos modificar
    let obj = {str: this.criteria};
    this.sessionService.getHomeConfig(this.pagConfig, obj);
    this.criteria = obj.str;
    // el signo + convierte de string a numero
    // el signo ! pasa de un string | null a string
    // para paginacion
    // this.pagConfig = new PaginationConfig();

    // esta pagina podria estarse armando desde el boton 'back' en company-detail
    // strCurrentPage: string;
    // this.backendCompany = environment.apiUrl;

    console.log("isAuthenticated: " + this.authenticationService.isAuthenticated());

    if (!this.authenticationService.isAuthenticated()) {
      this.sessionService.resetSessionData();
      this.router.navigate(['/login']);
    }

    if (this.pagConfig.currentPage > 0) {
      // venimos desde proyecto (boton back).... generamos los datos
      // el signo + convierte de string a numero

      this.spinner.show('sp3');

      this.getCompanyList();
    }

    this.sessionService.setHomeConfig(this.pagConfig, this.criteria);

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

    this.collection = this.companyList.slice(
      this.pagConfig.itemsPerPage * (newPage - 1),
      this.pagConfig.itemsPerPage * (newPage - 1) + this.pagConfig.itemsPerPage);

    this.sessionService.setHomeConfig(this.pagConfig, this.criteria);
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
    this.pagConfig.itemsPerPage = environment.itemsPerPage;
    this.pagConfig.autoHide = true;

    this.collection = [];

    this.criteria = criteria;
    // eliminamos mensaje de error si estuviera desplegado
    this.alertService.clear();

    /** spinner starts */
    this.spinner.show('sp3');

    this.getCompanyList();
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

        this.goToCompanyDetail(result.companyId);

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

  private getCompanyList(): void {
    // limpiamos variables de sesion
    this.sessionService.resetHomeSessionData();
    this.sessionService.resetCompanySessionData();
    this.sessionService.resetProjectSessionData();
    this.sessionService.resetFindingSessionData();

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

        // si this.pagConfig.currentPage > 0 venimos desde otra pagina o se recargo... vamos a la pagina donde estabamos
        if (this.pagConfig.currentPage == 0) {
          // hicimos busqueda con boton
          this.pagConfig.currentPage = 1;
        }

        this.pageChange(this.pagConfig.currentPage);

        this.spinner.hide('sp3');

        this.sessionService.setHomeConfig(this.pagConfig, this.criteria)
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

  private goToCompanyDetail(companyId: string) {

    this.router.navigate(['/company', {
      companyId: companyId /*,
      homeCurrentPage: this.sessionService.getSession().homePaginationConfig.currentPage,
      homeItemsPerPage: this.sessionService.getSession().homePaginationConfig.itemsPerPage,
      homeNumberOfPages: this.sessionService.getSession().homePaginationConfig.numberOfPages,
      homeTotalItems: this.sessionService.getSession().homePaginationConfig.totalItems,
    homeCriteria: this.sessionService.getSession().homeCriteria*/}]);

  }
}
