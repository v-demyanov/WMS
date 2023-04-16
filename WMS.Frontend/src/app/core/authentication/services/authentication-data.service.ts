import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { TokenStorageKeys } from '../constants/token-storage-keys.constants';
import { RefreshRequest } from '../models/refresh-request';
import { ITokenResponse } from '../models/token-response';
import { IUserClaims } from '../models/user-claims';
import { IUserCredentials } from '../models/user-credentials';
import { ApiEndpoints } from '../../constants/api-endpoints.constants';
import { parseEnum } from '../../helpers/enum.helper';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AuthenticationDataService {

  constructor(private readonly http: HttpClient) {}

  public isAuthorized = (): boolean =>
    !!localStorage.getItem(TokenStorageKeys.AccessToken);

  public getAccessToken = (): string | null =>
    localStorage.getItem(TokenStorageKeys.AccessToken);

  public setAccessToken(accessToken: string | null): AuthenticationDataService {
    if (accessToken !== null) {
      localStorage.setItem(TokenStorageKeys.AccessToken, accessToken);
    }

    return this;
  }

  public setRefreshToken(refreshToken: string | null): AuthenticationDataService {
    if (refreshToken !== null) {
      localStorage.setItem(TokenStorageKeys.RefreshToken, refreshToken);
    }

    return this;
  }

  public clearUserInfo(): void {
    localStorage.removeItem(TokenStorageKeys.AccessToken);
    localStorage.removeItem(TokenStorageKeys.RefreshToken);
    localStorage.removeItem(TokenStorageKeys.UserClaims);
  }

  public doesAccessTokenExist = (): boolean =>
    !!localStorage.getItem(TokenStorageKeys.AccessToken);

  public doesRefreshTokenExist = (): boolean =>
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
    const userClaimsJson: string | null = localStorage.getItem(
      TokenStorageKeys.UserClaims
    );

    if (userClaimsJson === null) {
      return null;
    }
    const userClaimsRaw: IUserClaims = JSON.parse(userClaimsJson);

    return {
      ...userClaimsRaw,
      Id: Number(userClaimsRaw.Id),
    };
  }

  public refreshToken(): Observable<ITokenResponse> {
    const refreshToken: string | null = localStorage.getItem(TokenStorageKeys.RefreshToken);
    const accessToken: string | null = localStorage.getItem(TokenStorageKeys.AccessToken);

    return this.http
      .post<ITokenResponse>(ApiEndpoints.AuthRefresh, <RefreshRequest>{
        AccessToken: accessToken,
        RefreshToken: refreshToken,
      })
      .pipe(
        tap((tokens: ITokenResponse) =>
          this.setAccessToken(tokens.AccessToken)
              .setRefreshToken(tokens.RefreshToken)),
        catchError((error) => {
          this.logout();

          return throwError(() => error);
        }),
      );
  }

  public login = (userCredentials: IUserCredentials): Observable<ITokenResponse> =>
    this.http.post<ITokenResponse>(
      ApiEndpoints.AuthLogin,
      userCredentials,
    );

  public logout = (): void => this.clearUserInfo();
}
