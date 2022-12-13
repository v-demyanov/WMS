import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class PermissionsService {

  constructor(private readonly authenticationService: AuthenticationService) {}

  public isAdmin = (): boolean =>
    this.authenticationService.getUserClaims()?.Role === UserRole.Administrator;

  public isAuditor = (): boolean =>
    this.authenticationService.getUserClaims()?.Role === UserRole.Auditor;
}
