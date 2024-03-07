import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from '../../interfaces/company'
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { AlertModule } from 'src/app/alert/alert.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgIf } from '@angular/common';
import { CompanyValidatorService } from 'src/app/services/company.validator.service';

@Component({
    selector: 'app-new-company',
    standalone: true,
    templateUrl: './new-company.component.html',
    styleUrl: './new-company.component.css',
    imports: [
      AlertModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgIf
    ],
    providers: [
      CompanyValidatorService,
      CompanyService
    ]
})
export class NewCompanyComponent {

  modalTitle: string;
  modalMessage: string;
  name: string = '';
  modalType: ModalType = ModalType.INFO;
  result: any;
  //formGroup: FormGroup;
  //formularioService: any;
  //companyService: CompanyService = {} as any;
  //alertService: AlertService = {} as any;
  //formBuilder: FormBuilder;
  ctrlName: FormControl = {} as any;
  errorMessage: string = '';
  success: boolean = false;
  options: any;

  constructor(
    private companyService: CompanyService,
    private companyValidatorService: CompanyValidatorService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<NewCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde company component onNew->openModal
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    console.log(data)
  }

  ngOnInit() {
    console.log("companyService: "+this.companyService)
      this.ctrlName = new FormControl(
        this.name,
        [
          Validators.required,
          Validators.pattern("^[A-Z].{0,127}$"),
          Validators.maxLength(128),
          Validators.minLength(3)
        ],
        [
          this.companyValidatorService.checkCompanyName()
        ]
      );
  }

  getErrorMessage() {
    if (this.ctrlName.hasError('required')) {
      return 'Debe ingresar el nombre';
    } else if (this.ctrlName.hasError('pattern')) {
      return 'Ingrese solamente texto';
    } else if (this.ctrlName.hasError('maxlength')) {
      return 'El m&aacute;ximo es 128 caracteres';
    } else if (this.ctrlName.hasError('minlength')) {
      return 'Ingrese al menos 3 caracteres';
    } else if (this.ctrlName.hasError('existsCompany')) {
      return 'Empresa con ese nombre ya existe';
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
    let company: Company = {} as Company;
    console.log("ok()")

    this.result = {
      name: this.ctrlName.value
    };

    console.log('result: '+this.result)

    console.log('this.ctrlName.valid: '+this.ctrlName.valid)

    if (!this.ctrlName.errors) {
      // grabamos nueva company
      company.name = this.ctrlName.value;
      this.companyService.save(company)
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
