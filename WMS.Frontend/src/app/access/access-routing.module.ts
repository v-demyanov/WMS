import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessRoute } from './access-routing.constants';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: AccessRoute.Default,
    redirectTo: AccessRoute.Login,
    pathMatch: 'full',
  },
  {
    path: AccessRoute.Login,
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoutingModule { }
