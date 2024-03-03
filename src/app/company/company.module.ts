import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { AlertModule } from '../alert/alert.module';
import { CompanyRoutingModule } from './company-routing/company-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from '../material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    NgxPaginationModule,
    AlertModule,
    MaterialModule,
    NgxSpinnerModule,
  ]
})
export class CompanyModule { }
