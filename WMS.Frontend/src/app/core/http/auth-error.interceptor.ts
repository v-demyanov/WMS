import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../authentication/services/authentication.service';
import { HttpStatusCodes } from '../constants/http-status-codes';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError(err => {
        const isHttpAuthErrorStatus = [HttpStatusCodes.Unauthorized, HttpStatusCodes.Forbidden].includes(err.status);
        if (isHttpAuthErrorStatus && this.authenticationService.isAuthorized()) {
          this.authenticationService.logout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(error);
      }));
  }
}
