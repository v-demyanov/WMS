import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitOfMeasurementsComponent } from './unit-of-measurements/unit-of-measurements.component';
import { AreasComponent } from './addresses/areas/areas.component';
import { RacksComponent } from './addresses/racks/racks.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';



@NgModule({
  declarations: [
    UnitOfMeasurementsComponent,
    AreasComponent,
    RacksComponent,
  ],
  imports: [
    CommonModule,
    DictionariesRoutingModule,
  ]
})
export class DictionariesModule { }
