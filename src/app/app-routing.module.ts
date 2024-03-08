import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home/home.component';
import { AuthGuardService } from './services/auth.guard.service';
import { LoginComponent } from './login/login/login.component';
import { ProjectComponent } from './project/project/project.component';
import { CompanyComponent } from './company/company/company.component';
import { FindingComponent } from './finding/finding/finding.component';
import { ReportComponent } from './report/report/report.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home',  component: HomeComponent, canActivate: [AuthGuardService], data: { animation: 'home' } },
  { path: 'company',  component: CompanyComponent, data: { animation: 'company' } },
  { path: 'project',  component: ProjectComponent, data: { animation: 'project' } },
  { path: 'finding',  component: FindingComponent, data: { animation: 'finding' } },
  { path: 'report',  component: ReportComponent, data: { animation: 'report' } },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
