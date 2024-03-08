import { NgFor, NgIf } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertModule } from "src/app/alert/alert.module";
import { Finding } from "src/app/interfaces/finding";
import { MaterialModule } from "src/app/material/material.module";
import { FindingService } from "src/app/services/finding.service";

export enum ModalType {
  INFO = 'info',
  WARN = 'warn'

}

@Component({
  selector: 'app-cam-snapshot',
  standalone: true,
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  imports: [
    AlertModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor
  ]
})
export class TextInputComponent {
  modalType: ModalType = ModalType.INFO;

  error: any;
  finding: Finding;

  result: any;

  text: string;
  modalTitle:string;

  ctrlText: FormControl;

  constructor(
    private findingService: FindingService,
    private dialogRef: MatDialogRef<TextInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde project component onNew->openModal
    this.modalTitle = data.modalTitle;
    //this.modalMessage = data.message;
    this.finding = data.finding;
    this.text = data.modalText;
    console.log(data)
  }

  ngOnInit() {

      this.ctrlText = new FormControl(
        this.text,
        [
          Validators.required,
          Validators.pattern("^[A-Z].{0,8192}$"),
          Validators.maxLength(8192),
          Validators.minLength(3)
        ],
        [

        ]
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ok() {
    //let finding: Finding = {} as Finding;
    console.log("ok()")

    this.result = {
      text: this.text
    };

    this.dialogRef.close(this.result);
    /*
    // grabamos el finding
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
      */
  }

}
