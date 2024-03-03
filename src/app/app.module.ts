import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';
import { CommonModule } from '@angular/common';
import { CompanyModule } from './company/company.module';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    CompanyModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [BnNgIdleService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
