import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindingComponent } from './finding/finding.component';

const routes: Routes = [
  { path: '', component: FindingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindingRoutingModule { }
