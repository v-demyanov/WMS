import { KeyValue, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { UI_ERROR_LABEL } from 'src/app/core/constants/common.constants';
import { formatDate } from 'src/app/core/helpers/date.helper';
import { ProblemStatusColors, ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import { IProblem } from '../models/problem';
import { ProblemsService } from '../services/problems.service';
import { ProblemDialogComponent } from '../problem-dialog/problem-dialog.component';
import { ProblemDialogData } from '../models/problem-dialog-data';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthenticationService, PermissionsService } from '../../core/authentication';
import { ProblemAssignDialogComponent } from '../problem-assign-dialog/problem-assign-dialog.component';
import { ProblemAssignDialogData } from '../models/problem-assign-dialog-data';

@Component({
  selector: 'app-problem-info',
  templateUrl: './problem-info.component.html',
  styleUrls: ['./problem-info.component.scss']
})
export class ProblemInfoComponent implements OnInit, OnDestroy {

  private componentSubscriptions: Subscription[] = [];

  public problem?: IProblem;

  public problemId?: number;

  public isLoading: boolean = false;

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;

  public problemStatusColors: KeyValue<ProblemStatus, string>[] = ProblemStatusColors;

  public problemStatus = ProblemStatus;

  public isCommentFormVisible: boolean = false;

  public isActivitiesPanelExpanded: boolean = false;

  public isSettingStatus: boolean = false;

  constructor(
    public readonly permissionsService: PermissionsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly problemsService: ProblemsService,
    private readonly snackBar: MatSnackBar,
    private readonly scroller: ViewportScroller,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.subscribeOnRouteParamsChanges(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public getProblemStatusTitle(): string {
    if (this.problem?.Status === undefined) {
      return '';
    }

    return this.problemStatusTitles[this.problem.Status].value;
  }

  public getProblemStatusColor(): string {
    if (this.problem?.Status === undefined) {
      return 'rgba(9,30,66,0.08)';
    }

    return this.problemStatusColors[this.problem.Status].value;
  }

  public scrollToCommentForm(): void {
    this.isActivitiesPanelExpanded = true;
    this.isCommentFormVisible = true;
    setTimeout(() => this.scroller.scrollToAnchor('commentForm'), 100);
  }

  public formatDate(undefinedLabel: string, date?: Date | null): string {
    if (date) {
      return formatDate(date);
    }
    return undefinedLabel;
  }

  public onAddSubProblemBtnClick(): void {
    this.dialog.open(ProblemDialogComponent, <MatDialogConfig>{
      ariaModal: true,
      disableClose: true,
      width: 'auto',
      data: <ProblemDialogData>{
        isCreating: true,
        parentProblemId: this.problemId,
      },
    });
  }

  public async onEditBtnClick(): Promise<void> {
    const dialogRef = this.dialog.open(ProblemDialogComponent, <MatDialogConfig>{
      ariaModal: true,
      disableClose: true,
      width: 'auto',
      data: <ProblemDialogData>{
        initialProblemId: this.problem?.Id,
        isEditing: true,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result && this.problemId) {
      this.loadProblem(this.problemId);
    }
  }

  public async openParentProblem(): Promise<void> {
    await this.router.navigate(
      [`${NavigationUrls.Tasks}/${this.problem?.ParentProblemId}`],
      {relativeTo: this.route},
    );
  }

  public async onDeleteBtnClick(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25rem',
      data: {
        dialogName: 'Удаление задачи',
        message: 'Вы действительно хотите удалить задачу? Также будут удалены все связанные подзадачи.',
      },
    });

    const isConfirmed: boolean = await firstValueFrom(dialogRef.afterClosed());
    if (!isConfirmed || !this.problemId) {
      return;
    }

    this.isLoading = true;
    const subscription: Subscription = this.problemsService.delete(this.problemId)
      .subscribe({
        next: async () => {
          this.isLoading = false;

          await this.router.navigate(
            [`${NavigationUrls.Tasks}`],
            {relativeTo: this.route},
          );
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при удалении задачи', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  public get canUserDeleteProblem(): boolean {
    return this.authenticationService.getUserClaims()?.Id === this.problem?.AuthorId;
  }

  public get canUserUpdateProblem(): boolean {
    return this.authenticationService.getUserClaims()?.Id === this.problem?.AuthorId;
  }

  public async onAssignBtnClick(): Promise<void> {
    const dialogRef = this.dialog.open(ProblemAssignDialogComponent, {
      ariaModal: true,
      disableClose: true,
      width: '20rem',
      data: <ProblemAssignDialogData> {
        Problem: this.problem,
      },
    });

    const problem: IProblem | undefined = await firstValueFrom(dialogRef.afterClosed());
    if (problem) {
      this.problem = problem;
    }
  }

  public onStatusChange(status: ProblemStatus): void {
    if (!this.problemId || !this.problem) {
      return;
    }

    this.isLoading = true;
    this.isSettingStatus = true;

    const subscription: Subscription = this.problemsService.updateStatus(status, this.problemId)
      .subscribe({
        next: () => {
          if (this.problem) {
            this.problem.Status = status;
          }
          
          this.snackBar.open('Статус задачи обновлён', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
          this.isSettingStatus = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при обновлении статуса задачи', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
          this.isSettingStatus = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  public getWareDisplayName(): string {
    if (this.problem?.Ware) {
      return `(${this.problem.Ware.Id}) ${this.problem.Ware.Name}`;
    }

    return '';
  }

  public getAddressDisplayValues(): string[] {
    const name: string | undefined = this.problem?.TargetAddress?.Area?.Name;
    const rackIndex: number | undefined = this.problem?.TargetAddress?.Shelf?.VerticalSection?.Rack?.Index;
    const sectionIndex: number | undefined = this.problem?.TargetAddress?.Shelf?.VerticalSection?.Index;
    const shelfIndex: number | undefined = this.problem?.TargetAddress?.Shelf?.Index;

    const areaDisplayName: string = name ? `Зона: ${name}` : '';
    const rackDisplayName: string = rackIndex ? `Стелаж: №${rackIndex}` : '';
    const sectionDisplayName: string = sectionIndex ? `Секция: №${sectionIndex}` : '';
    const shelfDisplayName: string = shelfIndex ? `Полка: №${shelfIndex}` : '';

    return [areaDisplayName, rackDisplayName, sectionDisplayName, shelfDisplayName].filter(x => x);
  }

  private subscribeOnRouteParamsChanges(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      this.problemId = Number(params['id']);
      if (this.problemId) {
        this.loadProblem(this.problemId);
      }
    });
  }

  private loadProblem(problemId: number): void {
    this.isLoading = true;
    const subscription: Subscription = this.problemsService.get(problemId)
      .subscribe({
        next: (problem: IProblem) => {
          this.problem = problem;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке задачи', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
