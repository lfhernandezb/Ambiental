import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AlertModule } from '../alert/alert.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from '../material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

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
export class HomeModule { }
