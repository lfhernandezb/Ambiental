import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModule } from 'src/app/alert/alert.module';
import { Company } from 'src/app/interfaces/company';
import { Project } from 'src/app/interfaces/project';
import { MaterialModule } from 'src/app/material/material.module';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';
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
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.css',
  providers: [
    ProjectValidatorService,
    ProjectService
  ]
})
export class NewProjectComponent {

  modalTitle: string;
  modalMessage: string;
  description: string = '';
  address: string = '';
  modalType: ModalType = ModalType.INFO;
  result: any = {};
  //formGroup: FormGroup;
  //formularioService: any;
  //companyService: CompanyService = {} as any;
  //alertService: AlertService = {} as any;
  //formBuilder: FormBuilder;
  ctrlDescription: FormControl = {} as any;
  ctrlAddress: FormControl = {} as any;
  errorMessage: string = '';
  success: boolean = false;
  options: any;
  company: Company;

  constructor(
    private companyService: CompanyService,
    private projectService: ProjectService,
    private projectValidatorService: ProjectValidatorService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<NewProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde project component onNew->openModal
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.company = data.company;
    console.log(data)
  }

  ngOnInit() {
    console.log("companyService: "+this.companyService)
      this.ctrlDescription = new FormControl(
        this.description,
        [
          Validators.required,
          Validators.pattern("^.{0,256}$"),
          Validators.maxLength(256),
          Validators.minLength(10)
        ],
        [
          this.projectValidatorService.checkProjectDescription(this.company.companyId.toString())
        ]
      );

      this.ctrlAddress = new FormControl(
        this.address,
        [
          Validators.required,
          Validators.pattern("^.{0,2048}$"),
          Validators.maxLength(2048),
          Validators.minLength(10)
        ],
        [
          // this.projectValidatorService.checkProjectDescription()
        ]
      );
  }

  getErrorMessage() {
    if (this.ctrlDescription.hasError('required')) {
      return 'Debe ingresar la descripci&oacute;n';
    } else if (this.ctrlDescription.hasError('pattern')) {
      return 'Ingrese solamente texto';
    } else if (this.ctrlDescription.hasError('maxlength')) {
      return 'El m&aacute;ximo es 256 caracteres';
    } else if (this.ctrlDescription.hasError('minlength')) {
      return 'Ingrese al menos 10 caracteres';
    } else if (this.ctrlDescription.hasError('existsProject')) {
      return 'Proyecto con esa descripción ya existe';
    }

    if (this.ctrlAddress.hasError('required')) {
      return 'Debe ingresar la direcci&oacute;n';
    } else if (this.ctrlAddress.hasError('pattern')) {
      return 'Ingrese solamente texto';
    } else if (this.ctrlAddress.hasError('maxlength')) {
      return 'El m&aacute;ximo es 2048 caracteres';
    } else if (this.ctrlAddress.hasError('minlength')) {
      return 'Ingrese al menos 10 caracteres';
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
    let project: Project = {} as Project;
    console.log("ok()")

    this.result = {
      description: this.ctrlDescription.value,
      address: this.ctrlAddress.value
    };

    console.log('result: '+this.result)

    console.log('this.ctrlDescription.valid: '+this.ctrlDescription.valid)

    console.log('this.ctrlAddress.valid: '+this.ctrlAddress.valid)

    if (!this.ctrlDescription.errors && !this.ctrlAddress.errors) {
      // grabamos nueva company
      project.description = this.ctrlDescription.value;
      project.address = this.ctrlAddress.value;
      project.companyId = this.company.companyId;

      this.projectService.save(project)
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
