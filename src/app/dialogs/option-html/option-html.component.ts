import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModule } from 'src/app/alert/alert.module';
import { Company } from 'src/app/interfaces/company';
import { Finding } from 'src/app/interfaces/finding';
import { FindingState } from 'src/app/interfaces/finding-state';
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
    NgIf,
    NgFor
  ],
  templateUrl: './option-html.component.html',
  styleUrls: ['./option-html.component.css'],
  providers: [
    ProjectValidatorService,
    ProjectService
  ]
})
export class OptionHtmlComponent implements OnInit {

  modalTitle: string;
  //modalMessage: string;
  modalType: ModalType = ModalType.INFO;
  result: any = {};
  //formGroup: FormGroup;
  //formularioService: any;
  //companyService: CompanyService = {} as any;
  //alertService: AlertService = {} as any;
  //formBuilder: FormBuilder;
  errorMessage: string = '';
  success: boolean = false;
  options: any;
  findingStateId: string;
  ctrlFindingStateId: FormControl;
  modalSelected: number;
  findingStates: FindingState[];

  constructor(
    private dialogRef: MatDialogRef<OptionHtmlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde finding component
    // this.finding = data.finding;
    this.modalTitle = data.modalTitle;
    this.modalSelected = data.modalSelected;
    this.findingStates = data.findingStates;
    console.log(data)
  }

  ngOnInit() {
    this.ctrlFindingStateId = new FormControl(this.findingStateId, [Validators.required]);
  }

  getErrorMessage() {
    if (this.ctrlFindingStateId.hasError('required')) {
      return 'Debe seleccionar un valor';
    }

    return 'Error desconocido';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ok() {
    console.log("ok()")

    this.result = {
      findingStateId: this.ctrlFindingStateId.value
    };

    if (!this.ctrlFindingStateId.errors) {
      this.dialogRef.close(this.result);
    }
  }
}

export enum ModalType {
  INFO = 'info',
  WARN = 'warn'

}
