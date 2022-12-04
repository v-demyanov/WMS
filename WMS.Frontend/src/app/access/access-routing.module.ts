import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccessRoutingConstants } from './access.routing.constants';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: AccessRoutingConstants.Default,
    redirectTo: AccessRoutingConstants.Login,
    pathMatch: 'full',
  },
  {
    path: AccessRoutingConstants.Login,
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoutingModule { }
