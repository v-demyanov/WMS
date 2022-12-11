import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaresComponent } from './wares.component';
import { WaresRoutingModule } from './wares-routing.module';
import { WaresNavigationComponent } from './wares-navigation/wares-navigation/wares-navigation.component';
import { WaresFormComponent } from './wares-form/wares-form/wares-form.component';
import { SharedModule } from '../shared/shared.module';
import { WaresToolbarComponent } from './wares-toolbar/wares-toolbar/wares-toolbar.component';


@NgModule({
  declarations: [
    WaresComponent,
    WaresNavigationComponent,
    WaresFormComponent,
    WaresToolbarComponent,
  ],
  imports: [
    CommonModule,
    WaresRoutingModule,
    SharedModule,
  ]
})
export class WaresModule { }
