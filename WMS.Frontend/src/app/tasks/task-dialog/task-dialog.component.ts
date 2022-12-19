import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import { EmployeesService } from 'src/app/admin-panel/employees/services/employees.service';
import { EmployeesDataService } from 'src/app/admin-panel/employees/services/employees-data.service';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';
import { AuthenticationService, UserRole } from 'src/app/core/authentication';
import { IProblem } from '../models/problem';
import { ProblemDialogData } from '../models/problem-dialog-data';
import { WaresService } from 'src/app/wares/services/wares.service';
import { IWare } from 'src/app/wares/models/ware';
import { ProblemsService } from '../services/problems.service';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { VerticalSectionsService } from 'src/app/dictionaries/addresses/racks/services/vertical-sections.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  providers: [EmployeesService, EmployeesDataService],
})
export class TaskDialogComponent implements OnInit, OnDestroy {

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;

  public isLoading: boolean = false;

  public isCreating: boolean = false;

  public isEditing: boolean = false;

  public isReadonly: boolean = false;

  public isCommentsDisplayed: boolean = false;

  public auditors: IEmployee[] = [];

  public employees: IEmployee[] = [];

  public wares: IWare[] = [];

  public problemForm: FormGroup = new FormGroup({});

  public problem?: IProblem;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ProblemDialogData,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private readonly userService: EmployeesService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
    private readonly waresService: WaresService,
    private readonly problemsService: ProblemsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly verticalSectionsService: VerticalSectionsService,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public ngOnInit(): void {
    this.isCreating = this.dialogData.isCreating;
    this.isEditing = this.dialogData.isEditing;
    this.isReadonly = !this.isCreating && ! this.isEditing;

    this.problemForm = this.createProblemForm();

    if (this.isReadonly || this.isEditing) {
      this.loadProblem();
    }
    else {
      this.initializeProblemForm();
    }

    this.componentSubscriptions = [
      this.loadEmployees(),
      this.loadWares(),
    ];
  }

  public get dialogTitle(): string {
    if (this.isCreating) {
      return 'Создание задачи';
    }

    if (this.isEditing) {
      return 'Редактирование задачи';
    }

    return 'Просмотр задачи';
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onSaveBtnClick(): void {
    if (this.isCreating) {
      this.createProblem();
    }
    else if (this.isEditing) {
      this.updateProblem();
    }
  }

  public onCommentBtnClick(): void {
    this.isCommentsDisplayed = this.isCommentsDisplayed ? false : true;
  }

  private createProblem(): void {
    const problem: IProblem = this.prepareProblemToCreate();
    const subscription: Subscription = this.problemsService.create(problem)
      .subscribe({
        next: async (problem: IProblem) => {
          this.snackBar.open(
            'Задача создана',
            'Закрыть',
            { duration: 3000 },
          );
          this.isLoading = false;

          this.dialogRef.close();
          await this.router.navigate(
            [NavigationUrls.Tasks],
            {relativeTo: this.route},
          );
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при создании задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
    this.componentSubscriptions.push(subscription);
  }

  private updateProblem(): void {

  }

  private loadProblem(): void {
    if (!this.dialogData.initialProblemId) {
      return;
    }

    this.isLoading = true;
    const subscription = this.problemsService.get(this.dialogData.initialProblemId)
      .subscribe({
        next: async (problem: IProblem) => {
          await this.setVerticalSections(problem);
          this.problem = problem;
          this.initializeProblemForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
    this.componentSubscriptions.push(subscription);
  }

  // TODO: Remove this method after MaxExpansionDepth will be set up right
  private async setVerticalSections(problem: IProblem): Promise<void> {
    const verticalSectionId: number | undefined = problem?.TargetAddress?.Shelf?.VerticalSectionId;
    if (verticalSectionId) {
      const verticalSection: IVerticalSection = await firstValueFrom(this.verticalSectionsService.get(verticalSectionId));
      problem!.TargetAddress!.Shelf!.VerticalSection = verticalSection;
    }
  }

  private loadEmployees(): Subscription {
    this.isLoading = true;
    return this.userService.getAll()
      .subscribe({
        next: (employees: IEmployee[]) => {
          this.employees = employees;
          this.auditors = employees.filter(x => x.role === UserRole.Auditor)
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке пользователей',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
  }

  private loadWares(): Subscription {
    this.isLoading = true;
    return this.waresService.getAllForNavigation()
      .subscribe({
        next: (wares: IWare[]) => {
          this.wares = wares;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке товаров',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
  }

  private createProblemForm(): FormGroup {
    return new FormGroup({
      Title: new FormControl(undefined, [Validators.required]),
      Description: new FormControl(undefined),
      Status: new FormControl(undefined, [Validators.required]),
      CreatedDate: new FormControl(undefined, [Validators.required]),
      LastUpdateDate: new FormControl(undefined),
      PerformerId: new FormControl(undefined),
      AuthorId: new FormControl(undefined, [Validators.required]),
      AuditorId: new FormControl(undefined),
      WareId: new FormControl(undefined),
      TargetAddress: new FormControl(undefined),
    });
  }

  private initializeProblemForm(): void {
    this.problemForm.setValue({
      Title: this.problem?.Title ?? null,
      Description: this.problem?.Description ?? null,
      Status: this.problem?.Status ?? null,
      CreatedDate: this.problem?.CreatedDate ?? null,
      LastUpdateDate: this.problem?.LastUpdateDate ?? null,
      PerformerId: this.problem?.PerformerId ?? null,
      AuthorId: this.getAuthorId(),
      AuditorId: this.problem?.AuditorId ?? null,
      WareId: this.problem?.WareId ?? null,
      TargetAddress: this.problem?.TargetAddress ?? null,
    });
  }

  private getAuthorId = (): number | null =>
    this.isCreating
      ? (this.authenticationService.getUserClaims()?.Id ?? null)
      : this.problem?.AuthorId ?? null;

  private prepareProblemToCreate(): IProblem {
    return {
      ...this.problemForm.value,
      Status: ProblemStatus[this.problemForm.value.Status],
    };
  }
}
