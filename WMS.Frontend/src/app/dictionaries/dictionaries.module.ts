import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { DictionariesPageComponent } from './dictionaries-page/dictionaries-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DictionariesPageComponent,
    DictionariesPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DictionariesRoutingModule,
  ]
})
export class DictionariesModule { }
