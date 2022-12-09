import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationUrls } from '../../constants/navigation-urls.constants';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class PublicGuard implements CanActivate, CanActivateChild {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthorized = this.authenticationService.isAuthorized();
    if (isAuthorized) {
      this.router.navigateByUrl(NavigationUrls.ProtectedFallbackPage);
    }

    return !isAuthorized;
  }

  public canActivateChild = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean => this.canActivate(route, state);
}
