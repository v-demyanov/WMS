import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddressesComponent } from './addresses.component';
import { AddressFormShelfComponent } from './address-form-shelf/address-form-shelf.component';
import { AddressFormAreaComponent } from './address-form-area/address-form-area.component';
import { AddressFormRackComponent } from './address-form-rack/address-form-rack.component';
import { AddressFormVerticalSectionComponent } from './address-form-vertical-section/address-form-vertical-section.component';
import { AddressesRoute } from './addresses-routing.constants';

const routes: Routes = [
  {
    path: AddressesRoute.Default,
    component: AddressesComponent,
    children: [
      {
        path: `${AddressesRoute.Area}/:areaId`,
        component: AddressFormAreaComponent,
      },
      {
        path: `${AddressesRoute.Area}/:areaId/${AddressesRoute.Rack}/:rackId`,
        component: AddressFormRackComponent,
      },
      {
        path: `${AddressesRoute.Area}/:areaId/${AddressesRoute.Rack}/:rackId/${AddressesRoute.VerticalSection}/:verticalSectionId`,
        component: AddressFormVerticalSectionComponent,
      },
      {
        path: `${AddressesRoute.Area}/:areaId/${AddressesRoute.Rack}/:rackId/${AddressesRoute.VerticalSection}/:verticalSectionId/${AddressesRoute.Shelf}/:shelfId`,
        component: AddressFormShelfComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressesRoutingModule { }
