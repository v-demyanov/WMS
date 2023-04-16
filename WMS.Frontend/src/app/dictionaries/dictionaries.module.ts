import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasComponent } from './addresses/areas/areas.component';
import { RacksComponent } from './addresses/racks/racks.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { DictionariesPageComponent } from './dictionaries-page/dictionaries-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DictionariesPageComponent,
    AreasComponent,
    RacksComponent,
    DictionariesPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DictionariesRoutingModule,
  ]
})
export class DictionariesModule { }
