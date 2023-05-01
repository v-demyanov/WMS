import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { AuthenticationService, PermissionsService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';
import { ProblemDialogData } from 'src/app/problems/models/problem-dialog-data';
import { ProblemDialogComponent } from 'src/app/problems/problem-dialog/problem-dialog.component';
import * as commonConstants from 'src/app/core/constants/common.constants';
import { SystemSettingBottomSheetComponent } from 'src/app/system-settings/system-setting-bottom-sheet/system-setting-bottom-sheet.component';

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
    private readonly bottomSheet: MatBottomSheet,
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
      ProblemDialogComponent, <MatDialogConfig> {
        ariaModal: true,
        disableClose: true,
        width: 'auto',
        data: <ProblemDialogData> {
          isCreating: true,
          isEditing: false,
        },
      },
    );
  }

  public onSettingsClick(): void {
    this.bottomSheet.open(SystemSettingBottomSheetComponent, {
      ariaModal: true,
      disableClose: true,
    });
  }
}
