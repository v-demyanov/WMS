import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IEmployee } from '../models/employee';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';

@Injectable()
export class EmployeesDataService {

  constructor(private readonly http: HttpClient) { }

  public getAll = (): Observable<IEmployee[]> =>
    this.http.get<IEmployee[]>(ApiEndpoints.Users);

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiEndpoints.Users}${id}`);
  }

  public create(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(ApiEndpoints.Users, employee);
  }

  public update(id: number, employeeUpdateData: IEmployee): Observable<void> {
    return this.http.put<void>(`${ApiEndpoints.Users}${id}`, employeeUpdateData);
  }
}
