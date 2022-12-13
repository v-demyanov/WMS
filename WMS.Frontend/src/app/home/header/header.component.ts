import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService, PermissionsService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';
import { ProblemDialogData } from 'src/app/tasks/models/problem-dialog-data';
import { TaskDialogComponent } from 'src/app/tasks/task-dialog/task-dialog.component';

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
    const dialogRef = this.dialog.open(
      TaskDialogComponent, {
        width: 'auto',
        data: <ProblemDialogData> {
          isCreating: true,
          isEditing: false,
        },
      },
    );
  }
}
