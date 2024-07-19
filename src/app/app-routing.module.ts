import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { HomeComponent } from './home/home/home.component';
import { AuthGuardService } from './services/auth.guard.service';
//import { LoginComponent } from './login/login/login.component';
//import { ProjectComponent } from './project/project/project.component';
//import { CompanyComponent } from './company/company/company.component';
//import { FindingComponent } from './finding/finding/finding.component';
//import { ReportComponent } from './report/report/report.component';
/*
eager-loading
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
*/

/*
lazy-loading - a design pattern that loads NgModules as needed.
Lazy loading helps keep initial bundle sizes smaller, which in turn helps decrease load times
*/
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home',  loadChildren: () => import('./home/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuardService], data: { animation: 'home' } },
  { path: 'company',  loadChildren: () => import('./company/company/company.component').then(m => m.CompanyComponent), data: { animation: 'company' } },
  { path: 'project',  loadChildren: () => import('./project/project/project.component').then(m => m.ProjectComponent), data: { animation: 'project' } },
  { path: 'finding',  loadChildren: () => import('./finding/finding/finding.component').then(m => m.FindingComponent), data: { animation: 'finding' } },
  { path: 'report',  loadChildren: () => import('./report/report/report.component').then(m => m.ReportComponent), data: { animation: 'report' } },
  { path: 'login', loadChildren: () => import('./login/login/login.component').then(m => m.LoginComponent) },
  { path: '**', loadChildren: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
