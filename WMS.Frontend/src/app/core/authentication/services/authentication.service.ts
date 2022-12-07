import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'ngx-auth';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

import { IUserClaims } from '../models/user-claims';
import { AuthenticationDataService } from './authentication-data.service';

@Injectable()
export class AuthenticationService implements AuthService {

  private interruptedUrl: string = '';

  constructor(
    private readonly authenticationDataService: AuthenticationDataService
  ) {}

  public isAuthorized = (): Observable<boolean> =>
    this.authenticationDataService.isAuthorized();

  public getAccessToken = (): Observable<string> =>
    of(this.authenticationDataService.getAccessToken());

  public getFullAccessToken = (): Observable<string> =>
    of(this.authenticationDataService.getAccessToken()).pipe(
      map((token) => `bearer ${token}`)
    );

  public setTokens(tokens: any): void {
    this.authenticationDataService.setAccessToken(tokens.AccessToken);
  }

  public getUserClaims = (): IUserClaims =>
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

    return jwtHelper.decodeToken(token);
  }

  public refreshToken(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public refreshShouldHappen(
    response: HttpErrorResponse,
    request?: HttpRequest<any> | undefined
  ): boolean {
    throw new Error('Method not implemented.');
  }
}
