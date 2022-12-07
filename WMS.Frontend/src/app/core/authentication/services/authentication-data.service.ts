import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TokenStorageKeys } from '../constants/token-storage-keys.constants';
import { IUserClaims } from '../models/user-claims';

@Injectable()
export class AuthenticationDataService {

  constructor(private readonly http: HttpClient) { }

  public isAuthorized(): Observable<boolean> {
    const isAuthorized: boolean = !!localStorage.getItem(TokenStorageKeys.AccessToken);

    return of(isAuthorized);
  }

  public getAccessToken = (): string =>
    localStorage.getItem(TokenStorageKeys.AccessToken) ?? '';

  public setAccessToken(accessToken: string): AuthenticationDataService {
    if (accessToken !== null) {
      localStorage.setItem(TokenStorageKeys.AccessToken, accessToken);
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

  public setUserClaims(userClaims: IUserClaims): void {
    if (userClaims !== null) {
      localStorage.setItem(TokenStorageKeys.UserClaims, JSON.stringify(userClaims));
    }
  }

  public getUserClaims(): IUserClaims | null
  {
    const userClaims: string | null = localStorage.getItem(TokenStorageKeys.UserClaims);

    return userClaims === null ? null : JSON.parse(userClaims);
  }
}
