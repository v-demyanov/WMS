import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesPageComponent } from './dictionaries-page/dictionaries-page.component';

const routes: Routes = [
  {
    path: ':name',
    component: DictionariesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DictionariesRoutingModule { }
