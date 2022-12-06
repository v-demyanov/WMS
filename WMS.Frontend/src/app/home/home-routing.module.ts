import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoute } from './home-routing.constants';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: HomeRoute.Default,
    redirectTo: HomeRoute.Wares,
    pathMatch: 'full',
  },
  {
    path: HomeRoute.Default,
    component: HomePageComponent,
    children: [
      {
        path: HomeRoute.AdminPanel,
        loadChildren: () => import('../admin-panel/admin-panel.module')
          .then(m => m.AdminPanelModule),
      },
    ],
  },
  {
    path: HomeRoute.Default,
    component: HomePageComponent,
    children: [
      {
        path: HomeRoute.Dictionaries,
        loadChildren: () => import('../dictionaries/dictionaries.module')
          .then(m => m.DictionariesModule),
      },
    ],
  },
  {
    path: HomeRoute.Default,
    component: HomePageComponent,
    children: [
      {
        path: HomeRoute.Wares,
        loadChildren: () => import('../wares/wares.module')
          .then(m => m.WaresModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
