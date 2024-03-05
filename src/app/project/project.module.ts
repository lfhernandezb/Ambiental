import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from '../alert/alert.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertComponent } from '../alert/alert/alert.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
   ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectModule { }
