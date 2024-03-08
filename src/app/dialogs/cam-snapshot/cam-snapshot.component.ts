import { NgFor, NgIf } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  templateUrl: './cam-snapshot.component.html',
  styleUrls: ['./cam-snapshot.component.css'],
  imports: [
    AlertModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor
  ]
})
export class CamSnapshotComponent implements AfterViewInit {
  WIDTH = 320;
  HEIGHT = 240;

  modalType: ModalType = ModalType.INFO;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  //captures: string[] = [];
  capturedPicture: string;

  error: any;
  isCaptured: boolean;

  finding: Finding;

  result: any;

  constructor(
    private findingService: FindingService,
    private dialogRef: MatDialogRef<CamSnapshotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde project component onNew->openModal
    this.finding = data.finding;
    console.log(data)
  }

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.capturedPicture = this.canvas.nativeElement.toDataURL("image/png");
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }
  /*
  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }
  */
  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ok() {
    //let finding: Finding = {} as Finding;
    console.log("ok()")

    this.result = {
      capturedPicture: this.capturedPicture
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
