import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { NavigationUrls } from '../../constants/navigation-urls.constants';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const isAuthorized = this.authenticationService.isAuthorized();
    if (!isAuthorized) {
      this.router.navigateByUrl(NavigationUrls.PublicFallbackPage);
      return false;
    }

    if (this.authenticationService.isAccessTokenExpired()) {
      return await firstValueFrom(this.refreshToken());
    }

    return isAuthorized;
  }

  public canActivateChild = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> => await this.canActivate(route, state);

  private refreshToken(): Observable<boolean> {
    return this.authenticationService.refreshToken()
    .pipe(
      map(() => true),
      catchError(() => {
        this.router.navigateByUrl(NavigationUrls.PublicFallbackPage);

        return of(false);
      })
    );
  }
}
