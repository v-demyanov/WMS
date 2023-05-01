import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { HeaderComponent } from './header/header.component';
import { MatModule } from '../mat/mat.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';

@NgModule({
  declarations: [
    HomePageComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatModule,
    SystemSettingsModule,
  ],
})
export class HomeModule { }
