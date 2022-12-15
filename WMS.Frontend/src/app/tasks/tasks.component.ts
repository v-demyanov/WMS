import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { ProblemStatusTitles } from './enums/enum-titles/problem-status-titles';
import { ProblemStatus } from './enums/problem-status.enum';
import { IProblem } from './models/problem';
import { ProblemDialogData } from './models/problem-dialog-data';
import { ProblemsService } from './services/problems.service';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { PermissionsService } from '../core/authentication';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {

  public toDo: IProblem[] = [];

  public inProgress: IProblem[] = [];

  public awaitingForApproval: IProblem[] = [];

  public done: IProblem[] = [];

  public problemStatus: typeof ProblemStatus = ProblemStatus;

  public isLoading: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly problemService: ProblemsService,
    private readonly snackBar: MatSnackBar,
    private readonly permissionsService: PermissionsService,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) => subscription.unsubscribe());

  public ngOnInit(): void {
    this.componentSubscriptions = [this.loadProblems()];
  }

  public get canUserChangeStatusToDone(): boolean {
    return (this.permissionsService.isAdmin() || this.permissionsService.isAuditor());
  }

  public get canUserEditProblem(): boolean {
    return this.permissionsService.isAdmin();
  }

  public drop(event: CdkDragDrop<IProblem[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.updateStatus(event);
  }

  public getColumnTitle = (problemStatus: ProblemStatus): string =>
    ProblemStatusTitles[problemStatus].value;

  public openTaskDialog(problem: IProblem, isEditing: boolean = false): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: 'auto',
      data: <ProblemDialogData>{
        initialProblemId: problem.Id,
        isCreating: false,
        isEditing: isEditing,
      },
    });

    // TODO: Replace data after updating
  }

  public loadProblems(): Subscription {
    return this.problemService.getAll().subscribe({
      next: (problems: IProblem[]) => {
        this.toDo = problems.filter((x) => x.Status === ProblemStatus.ToDo);
        this.inProgress = problems.filter((x) => x.Status === ProblemStatus.InProgress);
        this.awaitingForApproval = problems.filter((x) => x.Status === ProblemStatus.AwaitingForApproval);
        this.done = problems.filter((x) => x.Status === ProblemStatus.Done);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error.errorMessage, 'Закрыть', {
          duration: 3000,
        });
      },
      complete: () => (this.isLoading = false),
    });
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  private updateStatus(event: CdkDragDrop<IProblem[]>): void {
    // TODO: Fix problem with Id
    const problem: IProblem = event.previousContainer.data[event.previousIndex];
    const problemId: number = problem.Id;
    const newStatus: ProblemStatus = ProblemStatus[event.container.id as keyof typeof ProblemStatus];

    this.isLoading = true;
    const subscription: Subscription = this.problemService.updateStatus(newStatus, problemId).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Статус задачи обновлён', 'Закрыть', {
          duration: 3000,
        });
        problem.Status = newStatus;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error.errorMessage, 'Закрыть', {
          duration: 3000,
        });
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
      },
      complete: () => (this.isLoading = false),
    });
    this.componentSubscriptions.push(subscription);
  }
}
