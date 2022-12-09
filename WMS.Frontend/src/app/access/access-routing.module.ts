import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessRoute } from './access-routing.constants';
import { LoginComponent } from './login/login.component';
import { PublicGuard } from '../core/authentication/guards/public.guard';

const routes: Routes = [
  {
    path: AccessRoute.Default,
    redirectTo: AccessRoute.Login,
    pathMatch: 'full',
  },
  {
    path: AccessRoute.Login,
    component: LoginComponent,
    canActivate: [PublicGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoutingModule { }
