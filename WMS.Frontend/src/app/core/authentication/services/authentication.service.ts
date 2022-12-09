import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

import { IUserClaims } from '../models/user-claims';
import { AuthenticationDataService } from './authentication-data.service';
import { ITokenResponse } from '../models/token-response';
import { UserRole } from '../enums/user-role.enum';
import { parseEnum } from '../../helpers/enum.helper';
import { IUserCredentials } from '../models/user-credentials';
import { AppRoute } from 'src/app/app-routing.constants';
import { HttpStatusCodes } from '../../constants/http-status-codes';

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
      .setAccessToken(tokens.accessToken)
      .setRefreshToken(tokens.refreshToken);
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
      Id: rawClaims.Id,
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
    && this.authenticationDataService.isExistRefreshToken();

  public login = (userCredentials: IUserCredentials): Observable<ITokenResponse> =>
    this.authenticationDataService.login(userCredentials);  

  public logout(): void {
    this.authenticationDataService.logout();
    this.router.navigate([AppRoute.Access]);
  }
}
