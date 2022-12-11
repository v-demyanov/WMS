import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WaresRoute } from './wares-routing.constants';
import { WaresComponent } from './wares.component';

const routes: Routes = [
  {
    path: `${WaresRoute.Create}`,
    component: WaresComponent,
  },
  {
    path: `${WaresRoute.Default}:id`,
    component: WaresComponent,
  },
  {
    path: `${WaresRoute.Default}`,
    component: WaresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaresRoutingModule { }
