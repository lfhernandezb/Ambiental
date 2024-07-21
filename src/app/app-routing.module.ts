import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth.guard.service';

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
  { path: 'home',  loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuardService], data: { animation: 'home' } },
  { path: 'company',  loadChildren: () => import('./company/company.module').then(m => m.CompanyModule), data: { animation: 'company' } },
  { path: 'project',  loadChildren: () => import('./project/project.module').then(m => m.ProjectModule), data: { animation: 'project' } },
  { path: 'finding',  loadChildren: () => import('./finding/finding.module').then(m => m.FindingModule), data: { animation: 'finding' } },
  { path: 'report',  loadChildren: () => import('./report/report.module').then(m => m.ReportModule), data: { animation: 'report' } },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes,   {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
