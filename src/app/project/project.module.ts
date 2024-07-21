import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from '../alert/alert.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertComponent } from '../alert/alert/alert.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project/project.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    AlertModule,
    NgxPaginationModule,
    NgxSpinnerModule,
   ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectModule { }
