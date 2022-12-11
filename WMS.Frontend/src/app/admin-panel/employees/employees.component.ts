import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { KeyValue } from '@angular/common';
import { BehaviorSubject, Subscription, firstValueFrom } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { IEmployee } from './models/employee';
import { EmployeesDataService } from './services/employees-data.service';
import { EmployeesService } from './services/employees.service';
import { UserRoleTitles } from 'src/app/core/authentication/enums/enum-titles/user-role-titles';
import { UserRole } from 'src/app/core/authentication/enums/user-role.enum';
import { AuthenticationService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [
    EmployeesService,
    EmployeesDataService,
  ],
})
export class EmployeesComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];
  
  public dataSource: BehaviorSubject<AbstractControl[]> = new BehaviorSubject<AbstractControl[]>([]);
  
  public isLoading: boolean = false;

  public isEditing: boolean = false;

  public isAdding: boolean = false;

  public editingItemId: number | null = null;
  
  public currentUser: IUserClaims | null = null;

  public userRoleTitles: KeyValue<UserRole, string>[] = UserRoleTitles;

  public employeeFormRows: FormArray = this.formBuilder.array([]);

  public employeeForm: FormGroup = this.formBuilder.group({ 'employees': this.employeeFormRows });
  
  private componentSubscriptions: Subscription[] = [];

  private employeeTemp: IEmployee | null = null;

  @ViewChild(MatTable) table?: MatTable<IEmployee>;

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.loadEmployees(),
    ];

    this.currentUser = this.authenticationService.getUserClaims();
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public getUserRoleDisplayName = (userRole: UserRole): string =>
    UserRoleTitles.find(x => x.key === userRole)?.value ?? '';

  public async onRemoveBtnClick(id: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20rem',
      data: {
        dialogName: 'Удаление сотрудника',
        message: 'Вы действительно хотите удалить сотрудника?',
      },
    });

    const isConfirmed: boolean = await firstValueFrom(dialogRef.afterClosed());
    if (!isConfirmed) {
      return;
    }
    
    const isNewUser: boolean = id === 0;
    if (isNewUser) {
      const employeeIndex: number = 0;
      this.employeeFormRows.removeAt(employeeIndex);
      this.updateView();
      this.isAdding = false;
      return;
    }

    this.isLoading = true;
    const subscription: Subscription = this.employeesService.delete(id)
      .subscribe({
        next: () => {
          const employeeIndex: number = this.employeeFormRows.controls.findIndex(x => x.value.id === id);
          this.employeeFormRows.removeAt(employeeIndex);
          this.updateView();

          this.snackBar.open(
            'Пользователь удалён',
            'Закрыть',
            { duration: 3000 },
          );
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
    this.componentSubscriptions.push(subscription);
  }

  public onEditBtnClick(employee: IEmployee): void {
    this.isEditing = true;
    this.editingItemId = employee.id;
    this.employeeTemp = employee;
  }

  public onSaveBtnClick(employee: IEmployee): void {
    if (this.isEditing) {
      this.updateEmployee(employee);
    }
    else if (this.isAdding) {
      this.createEmployee(employee);
    }
  }

  public onResetBtnClick(employee: IEmployee): void {
    if (this.employeeTemp !== null) {
      const employeeIndex: number = this.employeeFormRows.controls.findIndex(x => x.value.id === employee.id);
      this.employeeFormRows.controls.splice(employeeIndex, 1, this.createFormGroup(this.employeeTemp));
      this.updateView();
    }

    this.employeeTemp = null;
    this.isEditing = false;
    this.editingItemId = null;
  }

  public onAddBtnClick(): void {
    this.isAdding = true;
    this.addFormGroup({ id: 0, lastName: '', firstName: '', role: UserRole.Worker, email: '' });
  }

  private loadEmployees(): Subscription {
    this.isLoading = true;
    return this.employeesService.getAll()
      .subscribe({
        next: (employees: IEmployee[]) => {
          employees.forEach(employee => this.addFormGroup(employee));

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

  private addFormGroup(employee: IEmployee): void {
    const formGroup: FormGroup = this.createFormGroup(employee);
    this.employeeFormRows.controls.unshift(formGroup);
    this.updateView();
  }

  private createFormGroup(employee: IEmployee): FormGroup {
    return this.formBuilder.group({
      'id': [employee.id, []],
      'firstName': [employee.firstName, [Validators.required]],
      'lastName': [employee.lastName, [Validators.required]],
      'email': [employee.email, [Validators.required, Validators.email]],
      'role': [employee.role, [Validators.required]],
    });
  }
  
  private updateView = (): void =>
    this.dataSource.next(this.employeeFormRows.controls);

  private updateEmployee(employeeUpdateData: IEmployee): void {
    const subscription: Subscription = this.employeesService.update(employeeUpdateData.id, employeeUpdateData)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Данные обновлены',
            'Закрыть',
            { duration: 3000 },
          );
          this.isLoading = false;
          this.isEditing = false;
          this.editingItemId = null;
        },
        error: (error) => {
          this.snackBar.open(
            error.error.errorMessage,
            'Закрыть',
            { duration: 3000 },
          );
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.isEditing = false;
          this.editingItemId = null;
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private createEmployee(employeeCreateData: IEmployee): void {
    this.isLoading = true;
    const subscription: Subscription = this.employeesService.create(employeeCreateData)
      .subscribe({
        next: (employee: IEmployee) => {
          const employeeIndex: number = 0;
          this.employeeFormRows.removeAt(employeeIndex);
          this.addFormGroup(employee);
          this.updateView();

          this.snackBar.open(
            'Сотрудник добавлен',
            'Закрыть',
            { duration: 3000 },
          );

          this.isAdding = false;
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
        complete: () => {
          this.isLoading = false;
          this.isAdding = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
