import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalEntitiesComponent } from './tenants/legal-entities/legal-entities.component';
import { IndividualsComponent } from './tenants/individuals/individuals.component';
import { AdminPageRoutingModule } from './admin-page-routing.module';
import { EmployeesComponent } from './employees/employees.component';

@NgModule({
  declarations: [
    LegalEntitiesComponent,
    IndividualsComponent,
    EmployeesComponent,
  ],
  imports: [
    CommonModule,
    AdminPageRoutingModule,
  ],
})
export class AdminPanelModule { }
