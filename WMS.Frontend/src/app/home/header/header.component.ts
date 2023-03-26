import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService, PermissionsService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';
import { ProblemDialogData } from 'src/app/problems/models/problem-dialog-data';
import { ProblemDialogComponent } from 'src/app/problems/problem-dialog/problem-dialog.component';
import * as commonConstants from 'src/app/core/constants/common.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public currentUser: IUserClaims | null = null;

  public commonConstants = commonConstants;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly permissionsService: PermissionsService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.authenticationService.getUserClaims();
  }

  public logout = (): void =>
    this.authenticationService.logout();

  public isAdmin = (): boolean =>
    this.permissionsService.isAdmin();

  public openTaskDialog(): void {
    this.dialog.open(
      ProblemDialogComponent, {
        width: 'auto',
        data: <ProblemDialogData> {
          isCreating: true,
          isEditing: false,
        },
      },
    );
  }
}
