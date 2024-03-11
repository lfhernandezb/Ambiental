import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Finding } from 'src/app/interfaces/finding';
import { Project } from 'src/app/interfaces/project';
import { AlertService } from 'src/app/services/alert.service';
import { FindingService } from 'src/app/services/finding.service';
import { NgFor } from '@angular/common';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertModule } from 'src/app/alert/alert.module';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-report',
  standalone: true,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  imports: [
    AlertModule,
    NgxSpinnerModule,
    NgFor
  ]
})
export class ReportComponent implements OnInit {
  projectId: string;
  project: Project;
  findingList: Finding[];
  companyName: string;
  projectDescription: string;
  projectAddress: string;
  options: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private findingService: FindingService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    this.companyName = this.route.snapshot.paramMap.get('companyName')!;
    this.projectDescription = this.route.snapshot.paramMap.get('projectDescription')!;
    this.projectAddress = this.route.snapshot.paramMap.get('projectAddress')!;

    // para mensajes de error
    this.options = {
      autoclose: false,
      keepAfterRouteChange: false
    };

    this.getFindingList();
  }

  private getFindingList(): void {
    this.spinner.show('sp3');
    this.findingService.
    getByDescriptionContainingAndProjectId('', this.projectId).
    subscribe(
      (data)=>{
        console.log(data);
        this.findingList = data as Finding[];

        this.spinner.hide('sp3');

      },
      (error) => {
        console.log('oops', error);
        if (error.status == 404) {
          this.alertService.info('No se encontraron registros', this.options);
        }
        else {
          // this.errorMessage = error;
          // console.log("triggering error");
          this.alertService.error(error.message, this.options);
        }

        this.spinner.hide('sp3');
      }

    );
  }

  public convetToPDF() {
    /*
    var data = document.getElementById('contentToConvert');
    html2canvas(data!).then(canvas => {
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'letter'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('new-file.pdf'); // Generated PDF
    });
    */
    if(screen.width < 1024) {
      document.getElementById("viewport")!.setAttribute("content", "width=1200px");
    }

    // para margenes
    const padding = document.getElementById("toAddPadding")!.style.padding;

    document.getElementById("toAddPadding")!.style.padding = "100px 200px";

    const data = document.getElementById('contentToConvert');
    let html2canvasOptions = {
      allowTaint: true,
      removeContainer: true,
      backgroundColor: null,
      imageTimeout: 15000,
      logging: true,
      scale: 2,
      useCORS: true
    };
    html2canvas(data!, html2canvasOptions).then(canvas => {
      // Few necessary setting options
      const contentDataURL = canvas.toDataURL('image/png')
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let pdf = new jspdf('p', 'mm', 'letter', true); // letter size page of PDF
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined,'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined,'FAST')
        heightLeft -= pageHeight;
      }
      pdf.save('resume.pdf'); // Generated PDF
      if(screen.width < 1024) {
        document.getElementById("viewport")!.setAttribute("content", "width=device-width, initial-scale=1");
      }

      document.getElementById("toAddPadding")!.style.padding = padding;
    });
  }
}
