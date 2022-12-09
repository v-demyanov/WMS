import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../authentication/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthorized = this.authenticationService.isAuthorized();
    const fullAccessToken: string = this.authenticationService.getFullAccessToken();

    if (isAuthorized) {
      request = request.clone({
        setHeaders: {
          Authorization: fullAccessToken,
        },
      });
    }

    return next.handle(request);
  }
}
