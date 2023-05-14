import { NgModule } from '@angular/core';

import { AddressesComponent } from './addresses.component';
import { SharedModule } from '../shared/shared.module';
import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesTreeComponent } from './addresses-tree/addresses-tree.component';
import { AddressFormShelfComponent } from './address-form-shelf/address-form-shelf.component';
import { AddressFormAreaComponent } from './address-form-area/address-form-area.component';
import { AddressFormRackComponent } from './address-form-rack/address-form-rack.component';
import { AddressFormVerticalSectionComponent } from './address-form-vertical-section/address-form-vertical-section.component';
import { AddressesToolbarComponent } from './addresses-toolbar/addresses-toolbar.component';

@NgModule({
  declarations: [
    AddressesComponent,
    AddressesTreeComponent,
    AddressFormShelfComponent,
    AddressFormAreaComponent,
    AddressFormRackComponent,
    AddressFormVerticalSectionComponent,
    AddressesToolbarComponent,
  ],
  imports: [
    SharedModule,
    AddressesRoutingModule,
  ]
})
export class AddressesModule { }
