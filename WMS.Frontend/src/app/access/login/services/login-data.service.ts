import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITokenResponse } from 'src/app/core/authentication/models/token-response';
import { IUserCredentials } from 'src/app/core/authentication/models/user-credentials';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { AuthenticationService } from 'src/app/core/authentication';

@Injectable()
export class LoginDataService {

  constructor(
    private readonly http: HttpClient,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public login(userCredentials: IUserCredentials): Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(
      ApiEndpoints.AuthLogin,
      userCredentials,
    );
  }

  public logout(): void {
    this.authenticationService.clearUserInfo();
  }
}
