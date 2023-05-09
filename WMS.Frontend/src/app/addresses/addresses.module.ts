import { NgModule } from '@angular/core';

import { AddressesComponent } from './addresses.component';
import { SharedModule } from '../shared/shared.module';
import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesTreeComponent } from './addresses-tree/addresses-tree.component';

@NgModule({
  declarations: [
    AddressesComponent,
    AddressesTreeComponent,
  ],
  imports: [
    SharedModule,
    AddressesRoutingModule,
  ]
})
export class AddressesModule { }
