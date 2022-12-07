import { Component, OnInit } from '@angular/core';

import { AuthenticationService, PermissionsService, UserRole } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';
import { LoginService } from 'src/app/access/login/services/login.service';
import { LoginDataService } from 'src/app/access/login/services/login-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [LoginService, LoginDataService],
})
export class HeaderComponent implements OnInit {

  public currentUser: IUserClaims | null = null;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly loginService: LoginService,
    private readonly permissionsService: PermissionsService,
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.authenticationService.getUserClaims();
  }

  public logout(): void {
    this.loginService.logout();
  }

  public isAdmin(): boolean {
    return this.permissionsService.isAdmin();
  }
}
