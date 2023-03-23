import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ITokenResponse } from 'src/app/core/authentication/models/token-response';
import { AuthenticationDataService, AuthenticationService } from 'src/app/core/authentication';
import { IUserClaims } from '../../core/authentication/models/user-claims';
import { AppRoute } from 'src/app/app-routing.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    AuthenticationService,
    AuthenticationDataService,
  ],
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({});

  public loading: boolean = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.value)
      .subscribe({
        next: (response: ITokenResponse) => {
          this.authenticationService.setTokens(response);
          const userClaims: IUserClaims = this.authenticationService.decodeJwtToken(response.accessToken);
          this.authenticationService.setUserClaims(userClaims);
          this.router.navigate([AppRoute.Home]);

          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.error.errorMessage,
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
  }

  private createLoginForm(): FormGroup {
    return new FormGroup({
      Email: new FormControl(undefined, [
        Validators.required,
        Validators.email,
      ]),
      Password: new FormControl(undefined, Validators.required),
    });
  }
}
