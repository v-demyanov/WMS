import { Component, OnInit } from '@angular/core';

import { AuthenticationService, PermissionsService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public currentUser: IUserClaims | null = null;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly permissionsService: PermissionsService,
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.authenticationService.getUserClaims();
  }

  public logout = (): void =>
    this.authenticationService.logout();

  public isAdmin = (): boolean =>
    this.permissionsService.isAdmin();
}
