import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { ReportRoutingModule } from './report-routing.module';
import { AlertModule } from '../alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    AlertModule,
    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class ReportModule { }
