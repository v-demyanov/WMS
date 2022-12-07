import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksRoute } from './tasks-routing.constants';
import { TasksComponent } from './tasks.component';

const routes: Routes = [{
  path: TasksRoute.Default,
  component: TasksComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule { }
