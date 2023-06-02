import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import { EmployeesService } from 'src/app/admin-panel/employees/services/employees.service';
import { EmployeesDataService } from 'src/app/admin-panel/employees/services/employees-data.service';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';
import { AuthenticationService, PermissionsService, UserRole } from 'src/app/core/authentication';
import { IProblem } from '../models/problem';
import { ProblemDialogData } from '../models/problem-dialog-data';
import { WaresService } from 'src/app/wares/services/wares.service';
import { ProblemsService } from '../services/problems.service';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { IWareNavItem } from 'src/app/wares/models/ware-nav-item';
import { WareStatus } from 'src/app/wares/enums/ware-status.enum';

@Component({
  selector: 'app-problem-dialog',
  templateUrl: './problem-dialog.component.html',
  styleUrls: ['./problem-dialog.component.scss'],
  providers: [EmployeesService, EmployeesDataService],
})
export class ProblemDialogComponent implements OnInit, OnDestroy {

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;

  public isLoading: boolean = false;

  public isCreating: boolean = false;

  public isEditing: boolean = false;

  public isReadonly: boolean = false;

  public auditors: IEmployee[] = [];

  public employees: IEmployee[] = [];

  public wares: IWareNavItem[] = [];

  public problemForm: FormGroup = new FormGroup({});

  public problem?: IProblem;

  public problemStatus = ProblemStatus;

  public wareStatus = WareStatus;

  public problemsDropDownValues: KeyValue<number, string>[] = [];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ProblemDialogData,
    public readonly permissionsService: PermissionsService,
    private dialogRef: MatDialogRef<ProblemDialogComponent>,
    private readonly userService: EmployeesService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
    private readonly waresService: WaresService,
    private readonly problemsService: ProblemsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public ngOnInit(): void {
    this.isCreating = this.dialogData.isCreating;
    this.isEditing = this.dialogData.isEditing;
    this.isReadonly = !this.isCreating && ! this.isEditing;

    this.problemForm = this.createProblemForm();
    this.loadProblemsDropDownValues();

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

  private createProblem(): void {
    const problem: IProblem = this.prepareProblemToSave();
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
            [`${NavigationUrls.Tasks}/${problem.Id}`],
            {relativeTo: this.route},
          );
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при создании задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private updateProblem(): void {
    if (!this.problem?.Id) {
      return;
    }

    const problemUpdateData: IProblem = this.prepareProblemToSave();
    const subscription: Subscription = this.problemsService.update(this.problem.Id, problemUpdateData)
      .subscribe({
        next: async () => {
          this.snackBar.open(
            'Задача обновлена',
            'Закрыть',
            { duration: 3000 },
          );
          this.isLoading = false;

          this.dialogRef.close(problemUpdateData);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при обновлении задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private loadProblem(): void {
    if (!this.dialogData.initialProblemId) {
      return;
    }

    this.isLoading = true;
    const subscription = this.problemsService.get(this.dialogData.initialProblemId)
      .subscribe({
        next: (problem: IProblem) => {
          this.problem = problem;
          this.initializeProblemForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private loadEmployees(): Subscription {
    this.isLoading = true;
    return this.userService.getAll()
      .subscribe({
        next: (employees: IEmployee[]) => {
          this.employees = employees;
          this.auditors = employees.filter(x => x.Role === UserRole.Auditor)
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке пользователей',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
  }

  private loadWares(): Subscription {
    this.isLoading = true;
    return this.waresService.getAllForNavigation()
      .subscribe({
        next: (wares: IWareNavItem[]) => {
          this.wares = wares;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке товаров',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
  }

  private createProblemForm(): FormGroup {
    return new FormGroup({
      Title: new FormControl(undefined, [Validators.required]),
      ParentProblemId: new FormControl(undefined),
      Description: new FormControl(undefined),
      Status: new FormControl(undefined, [Validators.required]),
      CreatedDate: new FormControl(undefined, [Validators.required]),
      LastUpdateDate: new FormControl(undefined),
      DeadlineDate: new FormControl(undefined),
      PerformerId: new FormControl(undefined),
      AuthorId: new FormControl(undefined, [Validators.required]),
      AuditorId: new FormControl(undefined),
      WareId: new FormControl(undefined, [Validators.required]),
      TargetShelfId: new FormControl(undefined, [Validators.required]),
    });
  }

  private initializeProblemForm(): void {
    this.problemForm.setValue({
      Title: this.problem?.Title ?? null,
      ParentProblemId: this.problem?.ParentProblemId ?? null,
      Description: this.problem?.Description ?? null,
      Status: this.problem?.Status ?? ProblemStatus.ToDo,
      CreatedDate: this.problem?.CreatedDate ?? null,
      LastUpdateDate: this.problem?.LastUpdateDate ?? null,
      DeadlineDate: this.problem?.DeadlineDate ?? null,
      PerformerId: this.problem?.PerformerId ?? null,
      AuthorId: this.getAuthorId(),
      AuditorId: this.problem?.AuditorId ?? null,
      WareId: this.problem?.WareId ?? null,
      TargetShelfId: this.problem?.TargetShelfId ?? null,
    });

    if (this.isCreating) {
      this.problemForm.controls['ParentProblemId'].setValue(this.dialogData?.parentProblemId);
      this.problemForm.controls['CreatedDate'].setValue(new Date());
    }
  }

  private getAuthorId = (): number | null =>
    this.isCreating
      ? (this.authenticationService.getUserClaims()?.Id ?? null)
      : this.problem?.AuthorId ?? null;

  private prepareProblemToSave(): IProblem {
    return {
      ...this.problemForm.value,
      Status: ProblemStatus[this.problemForm.value.Status],
    };
  }

  private loadProblemsDropDownValues(): void {
    this.isLoading = true;
    const subscription: Subscription = this.problemsService
      .getForDropDown()
      .subscribe({
        next: (values: KeyValue<number, string>[]) => {
          this.problemsDropDownValues = values;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке задач',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });

    this.componentSubscriptions.push(subscription);
  }
}
