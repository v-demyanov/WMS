import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProblemAssignDialogData } from '../models/problem-assign-dialog-data';
import { EmployeesService } from 'src/app/admin-panel/employees/services/employees.service';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';
import { EmployeesDataService } from 'src/app/admin-panel/employees/services/employees-data.service';
import { ProblemsService } from '../services/problems.service';

@Component({
  selector: 'app-problem-assign-dialog',
  templateUrl: './problem-assign-dialog.component.html',
  styleUrls: ['./problem-assign-dialog.component.scss'],
  providers: [EmployeesService, EmployeesDataService],
})
export class ProblemAssignDialogComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public performerForm: FormGroup = new FormGroup({});

  public employees: IEmployee[] = [];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ProblemAssignDialogData,
    private dialogRef: MatDialogRef<ProblemAssignDialogComponent>,
    private readonly userService: EmployeesService,
    private readonly snackBar: MatSnackBar,
    private readonly problemsService: ProblemsService,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public ngOnInit(): void {
    this.performerForm = this.createPerformerForm();

    this.componentSubscriptions = [
      this.loadEmployees(),
    ];
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public assign(): void {
    const performerId: number | null = this.performerForm.value.PerformerId;
    const problemId: number = this.dialogData.Problem.Id;
    this.isLoading = true;

    const subscription: Subscription = this.problemsService.assign(problemId, performerId)
      .subscribe({
        next: () => {
          this.dialogData.Problem.PerformerId = performerId;
          this.dialogData.Problem.Performer = this.employees.find(x => x.Id === performerId);
          this.isLoading = false;

          this.dialogRef.close(this.dialogData.Problem);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при назначении задачи',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private createPerformerForm(): FormGroup {
    return new FormGroup({
      PerformerId: new FormControl(undefined),
    });
  }

  private loadEmployees(): Subscription {
    this.isLoading = true;
    return this.userService.getAll()
      .subscribe({
        next: (employees: IEmployee[]) => {
          this.employees = employees;
          this.isLoading = false;
          this.initializePerformerForm();
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

  private initializePerformerForm(): void {
    this.performerForm.setValue({
      PerformerId: this.dialogData.Problem.PerformerId,
    });
  }
}
