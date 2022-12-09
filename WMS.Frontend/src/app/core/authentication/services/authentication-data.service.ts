import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { TokenStorageKeys } from '../constants/token-storage-keys.constants';
import { RefreshRequest } from '../models/refresh-request';
import { ITokenResponse } from '../models/token-response';
import { IUserClaims } from '../models/user-claims';
import { IUserCredentials } from '../models/user-credentials';
import { ApiEndpoints } from '../../constants/api-endpoints.constants';

@Injectable()
export class AuthenticationDataService {

  constructor(private readonly http: HttpClient) {}

  public isAuthorized(): boolean {
    const isAuthorized: boolean = !!localStorage.getItem(
      TokenStorageKeys.AccessToken
    );

    return isAuthorized;
  }

  public getAccessToken = (): string | null =>
    localStorage.getItem(TokenStorageKeys.AccessToken);

  public setAccessToken(accessToken: string | null): AuthenticationDataService {
    if (accessToken !== null) {
      localStorage.setItem(TokenStorageKeys.AccessToken, accessToken);
    }

    return this;
  }

  public setRefreshToken(
    refreshToken: string | null
  ): AuthenticationDataService {
    if (refreshToken !== null) {
      console.log(refreshToken);
      localStorage.setItem(TokenStorageKeys.RefreshToken, refreshToken);
    }

    return this;
  }

  public clearUserInfo(): void {
    localStorage.removeItem(TokenStorageKeys.AccessToken);
    localStorage.removeItem(TokenStorageKeys.RefreshToken);
    localStorage.removeItem(TokenStorageKeys.UserClaims);
  }

  public isExistAccessToken = (): boolean =>
    !!localStorage.getItem(TokenStorageKeys.AccessToken);

  public isExistRefreshToken = (): boolean =>
    !!localStorage.getItem(TokenStorageKeys.RefreshToken);

  public setUserClaims(userClaims: IUserClaims): void {
    if (userClaims !== null) {
      localStorage.setItem(
        TokenStorageKeys.UserClaims,
        JSON.stringify(userClaims)
      );
    }
  }

  public getUserClaims(): IUserClaims | null {
    const userClaims: string | null = localStorage.getItem(
      TokenStorageKeys.UserClaims
    );

    return userClaims === null ? null : JSON.parse(userClaims);
  }

  public refreshToken(): Observable<ITokenResponse> {
    const refreshToken: string | null = localStorage.getItem(
      TokenStorageKeys.RefreshToken
    );

    return this.http
      .post<ITokenResponse>(ApiEndpoints.AuthRefresh, <RefreshRequest>{
        RefreshToken: refreshToken,
      })
      .pipe(
        tap((tokens: ITokenResponse) =>
          this.setAccessToken(tokens.accessToken)
              .setRefreshToken(tokens.refreshToken)),
        catchError((error) => {
          this.logout();

          return throwError(() => error);
        }),
      );
  }

  public login = (userCredentials: IUserCredentials): Observable<ITokenResponse> =>
    this.http.post<ITokenResponse>(
      ApiEndpoints.AuthLogin,
      userCredentials
    );

  public logout = (): void =>
    this.clearUserInfo();
}
