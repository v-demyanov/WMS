import { NgModule } from '@angular/core';

import { LegalEntitiesComponent } from './tenants/legal-entities/legal-entities.component';
import { IndividualsComponent } from './tenants/individuals/individuals.component';
import { AdminPageRoutingModule } from './admin-page-routing.module';
import { EmployeesComponent } from './employees/employees.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LegalEntitiesComponent,
    IndividualsComponent,
    EmployeesComponent,
  ],
  imports: [
    AdminPageRoutingModule,
    SharedModule,
  ],
})
export class AdminPanelModule { }
