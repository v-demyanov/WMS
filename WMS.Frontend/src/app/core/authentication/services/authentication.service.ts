import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import * as _moment from 'moment';

import { IUserClaims } from '../models/user-claims';
import { AuthenticationDataService } from './authentication-data.service';
import { ITokenResponse } from '../models/token-response';
import { UserRole } from '../enums/user-role.enum';
import { parseEnum } from '../../helpers/enum.helper';
import { IUserCredentials } from '../models/user-credentials';
import { AppRoute } from 'src/app/app-routing.constants';
import { HttpStatusCodes } from '../../constants/http-status-codes';

const moment = _moment;

@Injectable()
export class AuthenticationService {

  private interruptedUrl: string = '';

  constructor(
    private readonly authenticationDataService: AuthenticationDataService,
    private readonly router: Router,
  ) {}

  public isAuthorized = (): boolean =>
    this.authenticationDataService.isAuthorized();

  public getAccessToken = (): string =>
    this.authenticationDataService.getAccessToken() ?? '';

  public getFullAccessToken = (): string =>
    `Bearer ${ this.authenticationDataService.getAccessToken() }`;

  public setTokens(tokens: ITokenResponse): void {
    this.authenticationDataService
      .setAccessToken(tokens.AccessToken)
      .setRefreshToken(tokens.RefreshToken);
  }

  public getUserClaims = (): IUserClaims | null =>
    this.authenticationDataService.getUserClaims();

  public setUserClaims = (userClaims: IUserClaims): void =>
    this.authenticationDataService.setUserClaims(userClaims);

  public getInterruptedUrl = (): string => this.interruptedUrl;

  public setInterruptedUrl(url: string): void {
    this.interruptedUrl = url;
  }

  public clearUserInfo = (): void =>
    this.authenticationDataService.clearUserInfo();

  public decodeJwtToken(token: string): IUserClaims {
    const jwtHelper = new JwtHelperService();
    const rawClaims = jwtHelper.decodeToken(token);
    
    return {
      Id: Number(rawClaims.Id),
      FirstName: rawClaims.FirstName,
      LastName: rawClaims.LastName,
      Role: parseEnum(UserRole, rawClaims.Role),
      Email: rawClaims.Email,
      Exp: rawClaims.exp,
    };
  }

  public refreshToken = (): Observable<ITokenResponse> =>
    this.authenticationDataService.refreshToken();

  public refreshShouldHappen = (response: HttpErrorResponse): boolean =>
    response.status === HttpStatusCodes.Unauthorized
    && this.authenticationDataService.doesRefreshTokenExist();

  public doesRefreshTokenExist = (): boolean => 
    this.authenticationDataService.doesRefreshTokenExist();

  public isAccessTokenExpired(): boolean {
    const accessTokenExpiration = this.getAccessTokenExpirationUtc();

    return moment().utc().isSameOrAfter(accessTokenExpiration);
  }

  private getAccessTokenExpirationUtc(): _moment.Moment {
    const accessToken: string = this.authenticationDataService.getAccessToken() ?? '';
    const tokenObject: IUserClaims = this.decodeJwtToken(accessToken);
    const expirationTimestamp: number = tokenObject.Exp;

    return moment.unix(expirationTimestamp).utc();
  }

  public login = (userCredentials: IUserCredentials): Observable<ITokenResponse> =>
    this.authenticationDataService.login(userCredentials);  

  public logout(): void {
    this.authenticationDataService.logout();
    this.router.navigate([AppRoute.Access]);
  }
}
