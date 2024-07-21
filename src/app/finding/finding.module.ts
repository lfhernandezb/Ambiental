import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindingRoutingModule } from './finding-routing.module';
import { AlertModule } from '../alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FindingComponent } from './finding/finding.component';



@NgModule({
  declarations: [
    FindingComponent  ],
  imports: [
    CommonModule,
    FindingRoutingModule,
    AlertModule,
    NgxPaginationModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FindingModule { }
