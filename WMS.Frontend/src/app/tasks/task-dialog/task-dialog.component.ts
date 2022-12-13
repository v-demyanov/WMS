import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import { EmployeesService } from 'src/app/admin-panel/employees/services/employees.service';
import { EmployeesDataService } from 'src/app/admin-panel/employees/services/employees-data.service';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';
import { AuthenticationService, UserRole } from 'src/app/core/authentication';
import { IProblem } from '../models/problem';
import { ProblemsService } from '../services/problems.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProblemDialogData } from '../models/problem-dialog-data';

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

  public auditors: IEmployee[] = [];

  public employees: IEmployee[] = [];

  public problemForm: FormGroup = new FormGroup({});

  public problem?: IProblem;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ProblemDialogData,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private readonly userService: EmployeesService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public ngOnInit(): void {
    this.isCreating = this.dialogData.isCreating;
    this.isEditing = this.dialogData.isEditing;
    this.isReadonly = !this.isCreating && ! this.isEditing;
    this.problem = this.dialogData?.problem;

    this.problemForm = this.createProblemForm();
    this.initializeProblemForm();

    this.componentSubscriptions = [
      this.loadEmployees(),
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
    this.dialogRef.close()
  }

  public onSaveBtnClick(): void {
    
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
            error.error.errorMessage,
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
    });
  }

  private getAuthorId = (): number | null =>
    this.isCreating 
      ? (this.authenticationService.getUserClaims()?.Id ?? null)
      : this.problem?.AuthorId ?? null;
}
