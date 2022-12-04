import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from './app-routing.constants';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: AppRoute.Access,
    component: LayoutComponent,
    children: [
      {
        path: AppRoute.Default,
        loadChildren: () => import('./access/access.module')
          .then(m => m.AccessModule),
      },
    ],
  },
  {
    path: AppRoute.Default,
    component: LayoutComponent,
    children: [
      {
        path: AppRoute.Home,
        loadChildren: () => import('./home/home.module')
          .then(m => m.HomeModule),
      },
      {
        path: '**',
        redirectTo: AppRoute.Home,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
