import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from '../alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //NgxPaginationModule,
    //AlertModule,
    //MaterialModule,
    //NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyModule { }
