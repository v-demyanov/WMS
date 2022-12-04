import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingConstants } from './home.routing.constants';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [{
  path: HomeRoutingConstants.Default,
  component: HomePageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
