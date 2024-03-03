import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompanyComponent } from './company/company/company.component';
import { AuthGuardService } from './services/auth.guard.service';
import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'company' },
  { path: 'home', pathMatch: 'full', redirectTo: 'company' },
  { path: 'company',  component: CompanyComponent, canActivate: [AuthGuardService], data: { animation: 'company' } },
  //{ path: 'formulario',  component: FormularioComponent, data: { animation: 'formulario' } },
  //{ path: 'formulario/:url/:fileName', redirectTo: '/formulario/:url/:fileName' },
  //{ path: 'formulario/:url/:formFileName/:path', component: FormularioComponent, data: { animation: 'formulario' } },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
