import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPanelRoute } from './admin-panel-routing.constants';
import { LegalEntitiesComponent } from './tenants/legal-entities/legal-entities.component';
import { IndividualsComponent } from './tenants/individuals/individuals.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
  {
    path: AdminPanelRoute.LegalEntities,
    component: LegalEntitiesComponent,
  },
  {
    path: AdminPanelRoute.Individuals,
    component: IndividualsComponent,
  },
  {
    path: AdminPanelRoute.Employees,
    component: EmployeesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
