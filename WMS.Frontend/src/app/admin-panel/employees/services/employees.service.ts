import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { EmployeesDataService } from './employees-data.service';
import { IEmployee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private readonly emplyeesDataService: EmployeesDataService) { }

  public getAll = (): Observable<IEmployee[]> => this.emplyeesDataService.getAll();

  public delete = (id: number): Observable<void> => this.emplyeesDataService.delete(id);

  public create = (employee: IEmployee): Observable<IEmployee> => this.emplyeesDataService.create(employee);

  public update = (id: number, employeeUpdateData: IEmployee): Observable<void> => this.emplyeesDataService.update(id, employeeUpdateData);
}
