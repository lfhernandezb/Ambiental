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
  WIDTH = 412;
  HEIGHT = 309;

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

  height: number;
  width: number;

  constructor(
    private findingService: FindingService,
    private dialogRef: MatDialogRef<CamSnapshotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // vienen de DialogConfig.data desde project component onNew->openModal
    this.finding = data.finding;
    console.log(data)
  }

  async ngAfterViewInit() {
    console.log('ngAfterViewInit');

    const portrait = window.matchMedia("(orientation: portrait)").matches;

    if (portrait) {
      console.log('ngAfterViewInit: portrait');
      this.setupPortrait();
    } else {
      console.log('ngAfterViewInit: landscape');
      this.setupLandscape();
    }

    window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
      const portrait = e.matches;

      if (portrait) {
          console.log("portrait")
          this.setupPortrait();

      } else {
          // do something else
          console.log("landscape")
          this.setupLandscape();
      }
    });

    await this.getDevices();

    await this.setupDevices();
  }

  async getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('devices: ', devices)
  }

  async setupDevices() {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          }
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

    this.height = this.video.nativeElement.offsetHeight;
    this.width = this.video.nativeElement.offsetWidth;

    console.log("height: "+this.height+" width: "+ this.width);

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

    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;

    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.width, this.height);

    //this.canvas.nativeElement.width = this.width;
    //this.canvas.nativeElement.height = this.height;

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
  }

  private setupPortrait() {
    // maximizamos el ancho

  }

  private setupLandscape() {
    //window.cli
  }

}
