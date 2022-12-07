import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUserCredentials } from 'src/app/core/authentication/models/user-credentials';
import { LoginDataService } from './login-data.service';
import { ITokenResponse } from 'src/app/core/authentication/models/token-response';
import { Router } from '@angular/router';
import { AppRoute } from 'src/app/app-routing.constants';

@Injectable()
export class LoginService {

  constructor(
    private readonly loginDataService: LoginDataService,
    private readonly router: Router,
  ) { }

  public login(userCredentials: IUserCredentials): Observable<ITokenResponse> {
    return this.loginDataService.login(userCredentials);  
  }

  public logout(): void {
    this.loginDataService.logout();
    this.router.navigate([AppRoute.Access]);
  }
}
