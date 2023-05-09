import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IRack } from '../models/rack';

@Injectable({
  providedIn: 'root'
})
export class RacksService {

  constructor(private readonly http: HttpClient) { }

  public getAllByAreaId(id: number): Observable<IRack[]> {
    return this.http.get<ODataValue<IRack>>(`${ApiEndpoints.Racks}?$filter=AreaId eq ${id}`)
      .pipe(map((odataValue: ODataValue<IRack>) => odataValue.value));
  }
}
