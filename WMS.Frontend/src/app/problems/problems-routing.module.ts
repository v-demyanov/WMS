import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProblemsRoute } from './problems-routing.constants';
import { ProblemsComponent } from './problems.component';
import { ProblemInfoComponent } from './problem-info/problem-info.component';

const routes: Routes = [
  {
    path: `${ProblemsRoute.Default}:id`,
    component: ProblemInfoComponent,
  },
  {
    path: ProblemsRoute.Default,
    component: ProblemsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemsRoutingModule { }
