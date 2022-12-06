import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaresComponent } from './wares.component';
import { WaresRoutingModule } from './wares-routing.module';


@NgModule({
  declarations: [
    WaresComponent,
  ],
  imports: [
    CommonModule,
    WaresRoutingModule,
  ]
})
export class WaresModule { }
