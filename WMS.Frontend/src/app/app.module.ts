import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AUTH_SERVICE,
  AuthModule,
  PROTECTED_FALLBACK_PAGE_URI,
  PUBLIC_FALLBACK_PAGE_URI,
} from 'ngx-auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AccessModule } from './access/access.module';
import { CoreModule } from './core/core.module';
import { AuthenticationService } from './core/authentication';
import { NavigationUrls } from './core/authentication/constants/navigation-urls';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccessModule,
    CoreModule,
    BrowserAnimationsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: PROTECTED_FALLBACK_PAGE_URI,
      useValue: NavigationUrls.ProtectedFallbackPage,
    },
    {
      provide: PUBLIC_FALLBACK_PAGE_URI,
      useValue: NavigationUrls.PublicFallbackPage,
    },
    { provide: AUTH_SERVICE, useClass: AuthenticationService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
