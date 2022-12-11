import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUnitOfMeasurements } from '../models/unit-of-measurements';
import { UnitOfMeasurementsDataService } from './unit-of-measurements-data.service';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasurementsService {

  constructor(private readonly unitOfMeasurementsDataService: UnitOfMeasurementsDataService) { }

  public getAll = (): Observable<IUnitOfMeasurements[]> =>
    this.unitOfMeasurementsDataService.getAll();
}
