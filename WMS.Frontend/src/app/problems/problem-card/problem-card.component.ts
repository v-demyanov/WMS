import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsService } from 'src/app/core/authentication/services/permissions.service';
import { formatDate } from 'src/app/core/helpers/date.helper';
import { IProblem } from '../models/problem';
import { ProblemDialogData } from '../models/problem-dialog-data';
import { ProblemDialogComponent } from '../problem-dialog/problem-dialog.component';

@Component({
  selector: 'app-problem-card',
  templateUrl: './problem-card.component.html',
  styleUrls: ['./problem-card.component.scss']
})
export class ProblemCardComponent {

  @Input()
  public item!: IProblem;

  public formatDate = formatDate;

  constructor(
    private readonly dialog: MatDialog,
    private readonly permissionsService: PermissionsService,
  ) {}

  public openTaskDialog(problem: IProblem, isEditing: boolean = false): void {
    const dialogRef = this.dialog.open(ProblemDialogComponent, {
      width: 'auto',
      data: <ProblemDialogData>{
        initialProblemId: problem.Id,
        isCreating: false,
        isEditing: isEditing,
      },
    });

    // TODO: Replace data after updating
  }

  public get canUserEditProblem(): boolean {
    return this.permissionsService.isAdmin();
  }
}
