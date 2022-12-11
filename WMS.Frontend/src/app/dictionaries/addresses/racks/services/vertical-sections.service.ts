import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IVerticalSection } from '../../models/vertical-section';

@Injectable({
  providedIn: 'root'
})
export class VerticalSectionsService {

  constructor(private readonly http: HttpClient) { }

  public getAllByRackId(id: number): Observable<IVerticalSection[]> {
    return this.http.get<ODataValue<IVerticalSection>>(`${ApiEndpoints.VerticalSections}?$filter=RackId eq ${id}`)
      .pipe(map((odataValue: ODataValue<IVerticalSection>) => odataValue.value));
  }

  public get(id: number): Observable<IVerticalSection> {
    return this.http.get<ODataValue<IVerticalSection>>(`${ApiEndpoints.VerticalSections}?$filter=Id eq ${id}&$expand=Rack`)
      .pipe(map((odataValue: ODataValue<IVerticalSection>) => odataValue.value[0]));
  }
}
