import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesRoute } from './dictionaries-routing.constants';
import { AreasComponent } from './addresses/areas/areas.component';
import { RacksComponent } from './addresses/racks/racks.component';
import { UnitOfMeasurementsComponent } from './unit-of-measurements/unit-of-measurements.component';

const routes: Routes = [
  {
    path: DictionariesRoute.Areas,
    component: AreasComponent,
  },
  {
    path: DictionariesRoute.Racks,
    component: RacksComponent,
  },
  {
    path: DictionariesRoute.UnitOfMeasurements,
    component: UnitOfMeasurementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DictionariesRoutingModule { }
