import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import * as _moment from 'moment';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationDataService } from '../services/authentication-data.service';
import { IUserClaims } from '../models/user-claims';
import { NavigationUrls } from '../../constants/navigation-urls.constants';

const moment = _moment;

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authenticationService: AuthenticationService,
    private authenticationDataService: AuthenticationDataService,
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

    if (this.isExpiredAccessToken()) {
      return await firstValueFrom(this.refreshToken());
    }

    return isAuthorized;
  }

  public canActivateChild = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> => await this.canActivate(route, state);

  private isExpiredAccessToken(): boolean {
    const accessTokenExpiration = this.getAccessTokenExpirationUtc();

    return moment().utc().isSameOrAfter(accessTokenExpiration);
  }

  private getAccessTokenExpirationUtc(): _moment.Moment {
    const accessToken: string = this.authenticationDataService.getAccessToken() ?? '';
    const tokenObject: IUserClaims = this.authenticationService.decodeJwtToken(accessToken);
    const expirationTimestamp: number = tokenObject.Exp;

    return moment.unix(expirationTimestamp).utc();
  }

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
