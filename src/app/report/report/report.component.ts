import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Finding } from 'src/app/interfaces/finding';
import { Project } from 'src/app/interfaces/project';
import { AlertService } from 'src/app/services/alert.service';
import { FindingService } from 'src/app/services/finding.service';
import { NgFor } from '@angular/common';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertModule } from 'src/app/alert/alert.module';

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

}
