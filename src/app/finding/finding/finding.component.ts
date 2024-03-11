import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertModule } from 'src/app/alert/alert.module';
import { AlertComponent } from 'src/app/alert/alert/alert.component';
import { CamSnapshotComponent } from 'src/app/dialogs/cam-snapshot/cam-snapshot.component';
import { NewProjectComponent } from 'src/app/dialogs/new-project/new-project.component';
import { OptionHtmlComponent } from 'src/app/dialogs/option-html/option-html.component';
import { TextInputComponent } from 'src/app/dialogs/text-input/text-input.component';
import { Company } from 'src/app/interfaces/company';
import { Finding } from 'src/app/interfaces/finding';
import { FindingState } from 'src/app/interfaces/finding-state';
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
    NgxSpinnerModule,
    DatePipe
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

  findinStates: FindingState[] = [
    {findingStateId: 1, description: 'Pendiente'},
    {findingStateId: 2, description: 'Ok'},
    {findingStateId: 3, description: 'Solicitado'},
    {findingStateId: 4, description: 'En revisión'},
    {findingStateId: 5, description: 'N/A'},
  ]

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

  private openCamSnapshotModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 260;

    dialogConfig.width = "100vw";
    //dialogConfig.height = "100vh";
    dialogConfig.maxWidth = '100vw'
    //dialogConfig.minHeight = 'calc(100vh - 90px)';
    //dialogConfig.height = 'auto';

    dialogConfig.height = "100vh";
    dialogConfig.maxHeight = "100vh";
    //dialogConfig.width = "100vw";
    //dialogConfig.width = 'auto';
    /*
    const portrait = window.matchMedia("(orientation: portrait)").matches;

    if (portrait) {
      console.log('openCamSnapshotModal: portrait');
      dialogConfig.width = "100vw";
      //dialogConfig.height = "100vh";
      dialogConfig.maxWidth = '100vw'
      //dialogConfig.minHeight = 'calc(100vh - 90px)';
      dialogConfig.height = 'auto';
    } else {
      console.log('openCamSnapshotModal: landscape');
      dialogConfig.height = "100vh";
      dialogConfig.maxHeight = "100vh";
      //dialogConfig.width = "100vw";
      dialogConfig.width = 'auto';
    }
    */


    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
        finding: this.finding
    };

    const dialogRef = this.dialog.open(CamSnapshotComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        //console.log('ok');
        this.finding.image = result.capturedPicture;
        this.finding.date = new Date();

        this.findingService.update(this.finding)
        .subscribe(
          // en data queda la nueva compania creada
          (data)=>{
            // success
            console.log('finding successfully saved: '+data);
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

            //this.spinner.hide('sp3');
          }
        )
      }
    });
  }

  private openDescriptionInputTextModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 260;
    dialogConfig.width = "600px";
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
        finding: this.finding,
        modalTitle: 'Ingrese descrpción',
        modalText: this.finding.description,
    };

    const dialogRef = this.dialog.open(TextInputComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        //console.log('ok');
        this.finding.description = result.text;
        this.finding.date = new Date();

        this.findingService.update(this.finding)
        .subscribe(
          // en data queda la nueva compania creada
          (data)=>{
            // success
            console.log('finding successfully saved: '+data);
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

            //this.spinner.hide('sp3');
          }
        )

      }
    });
  }

  private openCommentInputTextModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 260;
    dialogConfig.width = "600px";
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
        finding: this.finding,
        modalTitle: 'Ingrese comentario',
        modalText: this.finding.comment
    };

    const dialogRef = this.dialog.open(TextInputComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        //console.log('ok');
        this.finding.comment = result.text;
        this.finding.date = new Date();

        this.findingService.update(this.finding)
        .subscribe(
          // en data queda la nueva compania creada
          (data)=>{
            // success
            console.log('finding successfully saved: '+data);
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

            //this.spinner.hide('sp3');
          }
        )
      }
    });
  }

  private openFindingStateOptionModal() {
    // console.log("openModal()");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 260;
    dialogConfig.width = "600px";
    dialogConfig.data = {
        //organization: environment.defaultOranization,
        //algorithm: environment.defaultAlgorithm
        //finding: this.finding,
        modalTitle: 'Seleccione estado del hallazgo',
        modalSelected: this.finding.findingStateId,
        findingStates: this.findinStates
    };

    const dialogRef = this.dialog.open(OptionHtmlComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {

        //console.log('ok');
        this.finding.findingStateId = result.findingStateId;
        this.finding.date = new Date();

        this.findingService.update(this.finding)
        .subscribe(
          // en data queda la nueva compania creada
          (data)=>{
            // success
            console.log('finding successfully saved: '+data);

            // actualizamos estado en pantalla
            this.finding.findingState.description = this.findinStates.find((item) => { return item.findingStateId == this.finding.findingStateId})!.description; //.at(this.finding.findingStateId)?.description!;
            // this.finding.findingState.findingStateId = data.findingState.findingStateId;
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

            //this.spinner.hide('sp3');
          }
        )

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
    // truco
    this.openDescriptionInputTextModal();
  }

  public editComment() {
    this.openCommentInputTextModal();
  }

  public editImage() {
    this.openCamSnapshotModal();
  }

  public editStatus() {
    this.openFindingStateOptionModal();
  }


}
