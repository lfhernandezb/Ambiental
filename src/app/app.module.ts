import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { NewCompanyComponent } from './dialogs/new-company/new-company.component';
import { NewProjectComponent } from './dialogs/new-project/new-project.component';
import { NewFindingComponent } from './dialogs/new-finding/new-finding.component';
import { CompanyService } from './services/company.service';
import { CompanyValidatorService } from './services/company.validator.service';
import { HomeComponent } from './home/home/home.component';
import { CompanyModule } from './company/company.module';
import { CompanyComponent } from './company/company/company.component';
import { CamSnapshotComponent } from './dialogs/cam-snapshot/cam-snapshot.component';
import { TextInputComponent } from './dialogs/text-input/text-input.component';
import { OptionHtmlComponent } from './dialogs/option-html/option-html.component';
import { ReportComponent } from './report/report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
  ],
  imports: [
    OptionHtmlComponent,
    TextInputComponent,
    CamSnapshotComponent,
    AppRoutingModule,
    BrowserModule,
    LayoutModule,
    CompanyComponent,
    HomeComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NewCompanyComponent,
    NewProjectComponent,
    NewFindingComponent
  ],
  providers: [
    BnNgIdleService,
    provideAnimationsAsync(),
    //CompanyValidatorService,
    //CompanyService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
