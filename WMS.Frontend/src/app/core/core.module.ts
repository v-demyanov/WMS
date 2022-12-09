import { NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { AuthenticationDataService } from './authentication/services/authentication-data.service';
import { AuthenticationService } from './authentication/services/authentication.service';
import { AuthGuard } from './authentication/guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { PermissionsService } from './authentication';
import { PublicGuard } from './authentication/guards/public.guard';

const providers: Provider[] = [
  AuthenticationDataService,
  AuthenticationService,
  PermissionsService,
  AuthGuard,
  PublicGuard,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, AppRoutingModule, HttpClientModule],
  providers: providers,
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import Core modules in the AppModule only.',
      );
    }
  }
}