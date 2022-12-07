import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { ProtectedGuard, PUBLIC_FALLBACK_PAGE_URI } from 'ngx-auth';
import * as _moment from 'moment';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationDataService } from '../services/authentication-data.service';
import { IUserClaims } from '../models/user-claims';

const moment = _moment;

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private protectedGuard: ProtectedGuard,
    private authenticationService: AuthenticationService,
    private authenticationDataService: AuthenticationDataService,
    private router: Router,
    @Inject(PUBLIC_FALLBACK_PAGE_URI) private publicFallbackPageUri: string
  ) {}

  public canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> =>
    this.protectedGuard.canActivate(route, state).pipe(
      switchMap((authorized: boolean) => {
        if (authorized && this.isExpiredAccessToken()) {
          this.router.navigateByUrl(this.publicFallbackPageUri);

          return throwError('The access token has been expired!');
        }

        return of(authorized);
      })
    );

  public canActivateChild = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> => this.canActivate(route, state);

  private isExpiredAccessToken(): boolean {
    const accessTokenExpiration = this.getAccessTokenExpirationUtc();

    return moment().utc().isSameOrAfter(accessTokenExpiration);
  }

  private getAccessTokenExpirationUtc(): _moment.Moment {
    const accessToken: string = this.authenticationDataService.getAccessToken();
    const tokenObject: IUserClaims =
      this.authenticationService.decodeJwtToken(accessToken);
    const expirationTimestamp: number = tokenObject.Exp;

    return moment.unix(expirationTimestamp).utc();
  }
}
