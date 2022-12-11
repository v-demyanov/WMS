import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IArea } from '../../models/area';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private readonly http: HttpClient) { }

  public getAll(): Observable<IArea[]> {
    return this.http.get<ODataValue<IArea>>(ApiEndpoints.Areas)
      .pipe(map((odataValue: ODataValue<IArea>) => odataValue.value));
  }
}
