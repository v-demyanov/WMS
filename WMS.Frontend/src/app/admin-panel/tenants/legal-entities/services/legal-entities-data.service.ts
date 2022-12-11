import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { ILegalEntity } from '../models/legal-entity';

@Injectable({
  providedIn: 'root'
})
export class LegalEntitiesDataService {

  constructor(private readonly http: HttpClient) { }

  public getAllForSelectionList(): Observable<ILegalEntity[]> {
    const selectQuery: string = '$select=Id,Name,Type';

    return this.http.get<ODataValue<ILegalEntity>>(`${ApiEndpoints.LegalEntities}?${selectQuery}`)
      .pipe(map((odataValue: ODataValue<ILegalEntity>) => odataValue.value));
  }
}
