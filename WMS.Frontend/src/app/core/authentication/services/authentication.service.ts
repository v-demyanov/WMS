import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'ngx-auth';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

import { IUserClaims } from '../models/user-claims';
import { AuthenticationDataService } from './authentication-data.service';
import { ITokenResponse } from '../models/token-response';
import { UserRole } from '../enums/user-role.enum';
import { parseEnum } from '../../helpers/enum.helper';

@Injectable()
export class AuthenticationService implements AuthService {

  private interruptedUrl: string = '';

  constructor(
    private readonly authenticationDataService: AuthenticationDataService,
  ) {}

  public isAuthorized = (): Observable<boolean> =>
    this.authenticationDataService.isAuthorized();

  public getAccessToken = (): Observable<string> =>
    of(this.authenticationDataService.getAccessToken());

  public getFullAccessToken(): Observable<string> {
    return of(this.authenticationDataService.getAccessToken()).pipe(
      map((token) => `bearer ${token}`)
    );
  }

  public setTokens(tokens: ITokenResponse): void {
    this.authenticationDataService.setAccessToken(tokens.accessToken);
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

  public verifyTokenRequest = (url: string): boolean =>
    this.isTokenRequest(url);

  public isTokenRequest = (url: string): boolean =>
    url.endsWith('connect/token');

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

  public refreshToken(): Observable<any> {
    return of();
  }

  public refreshShouldHappen(
    response: HttpErrorResponse,
    request?: HttpRequest<any> | undefined
  ): boolean {
    return false;
  }
}
