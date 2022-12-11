import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';

import { IUnitOfMeasurements } from '../models/unit-of-measurements';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasurementsDataService {

  constructor(private readonly http: HttpClient) { }

  public getAll = (): Observable<IUnitOfMeasurements[]> =>
    this.http.get<IUnitOfMeasurements[]>(ApiEndpoints.UnitOfMeasurements);
}
