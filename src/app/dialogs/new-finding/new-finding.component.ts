import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModule } from 'src/app/alert/alert.module';
import { Company } from 'src/app/interfaces/company';
import { Finding } from 'src/app/interfaces/finding';
import { Project } from 'src/app/interfaces/project';
import { MaterialModule } from 'src/app/material/material.module';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
import { FindingValidatorService } from 'src/app/services/finding-validator.service';
import { FindingService } from 'src/app/services/finding.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectValidatorService } from 'src/app/services/project.validator.service';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [
    AlertModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './new-finding.component.html',
  styleUrl: './new-finding.component.css',
  providers: [
    ProjectValidatorService,
    ProjectService
  ]
})
export class NewFindingComponent {

  modalTitle: string;
  modalMessage: string;
  identifier: string = '';
  modalType: ModalType = ModalType.INFO;
  result: any = {};
  //formGroup: FormGroup;
  //formularioService: any;
  //companyService: CompanyService = {} as any;
  //alertService: AlertService = {} as any;
  //formBuilder: FormBuilder;
  ctrlIdentifier: FormControl = {} as any;
  errorMessage: string = '';
  success: boolean = false;
  options: any;
  company: Company = {} as Company;
  project: Project = {} as Project;
  finding: Finding = {} as Finding;

  constructor(
    private companyService: CompanyService,
    private projectService: ProjectService,
    private findingService: FindingService,
    private findingValidatorService: FindingValidatorService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<NewFindingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde project component onNew->openModal
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.company = data.company;
    this.project = data.project;
    console.log(data)
  }

  ngOnInit() {
    console.log("companyService: "+this.companyService)
      this.ctrlIdentifier = new FormControl(
        this.identifier,
        [
          Validators.required,
          Validators.pattern("^.{0,16}$"),
          Validators.maxLength(16),
          Validators.minLength(4)
        ],
        [
          this.findingValidatorService.checkFindingByIdentifierAndProjectId(this.project.projectId.toString())
        ]
      );
  }

  getErrorMessage() {
    if (this.ctrlIdentifier.hasError('required')) {
      return 'Debe ingresar el identificador';
    } else if (this.ctrlIdentifier.hasError('pattern')) {
      return 'Ingrese solamente texto';
    } else if (this.ctrlIdentifier.hasError('maxlength')) {
      return 'El m&aacute;ximo es 16 caracteres';
    } else if (this.ctrlIdentifier.hasError('minlength')) {
      return 'Ingrese al menos 4 caracteres';
    } else if (this.ctrlIdentifier.hasError('existsFinding')) {
      return 'Hallazgo con ese identificador ya existe';
    }

    return 'Unknown error';
  }

  //get url() { return this.formGroup.get('url'); }

  //get organization() { return this.formGroup.get('organization'); }

  //get algorithm() { return this.formGroup.get('algorithm'); }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ok() {
    let finding: Finding = {} as Finding;
    console.log("ok()")

    this.result = {
      identifier: this.ctrlIdentifier.value,
    };

    console.log('result: '+this.result)

    console.log('this.ctrlDescription.valid: '+this.ctrlIdentifier.valid)

    if (!this.ctrlIdentifier.errors) {
      // grabamos nuevo finding
      finding.identifier = this.ctrlIdentifier.value;
      finding.description = '*';
      finding.comment = '*';
      finding.findingStateId = 1; // pendiente
      finding.date = new Date();
      finding.projectId = this.project.projectId;

      this.findingService.save(finding)
      .subscribe(
        // en data queda la nueva compania creada
        (data)=>{
          // success
          console.log('new company created: '+data);
          this.dialogRef.close(data);
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
  }
  /*
  close() {
    console.log("close()")
    this.dialogRef.close();
  }
  */
}

export enum ModalType {
  INFO = 'info',
  WARN = 'warn'

}
