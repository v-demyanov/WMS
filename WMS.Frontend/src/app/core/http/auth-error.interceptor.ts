import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

import { AuthenticationService } from '../authentication/services/authentication.service';
import { HttpStatusCodes } from '../constants/http-status-codes';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError(err => {
        const error = (err && err.error && err.error.message) || err.statusText;
        const isHttpAuthErrorStatus = [HttpStatusCodes.Unauthorized, HttpStatusCodes.Forbidden].includes(err.status);

        if (err.status === HttpStatusCodes.Unauthorized && this.authenticationService.isAccessTokenExpired()) {
          this.refreshToken();
          return throwError(error);
        }

        if (isHttpAuthErrorStatus && this.authenticationService.isAuthorized()) {
          this.authenticationService.logout();
        }

        return throwError(error);
      }));
  }

  private refreshToken(): void {
    this.authenticationService.refreshToken()
      .pipe(
        catchError(() => {
          this.authenticationService.logout();

          return of();
        })
      )
      .subscribe();
  }
}
