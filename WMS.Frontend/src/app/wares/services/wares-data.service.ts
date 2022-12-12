import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IWare } from '../models/ware';

@Injectable({
  providedIn: 'root'
})
export class WaresDataService {

  constructor(private readonly http: HttpClient) { }

  public getAllForNavigation(): Observable<IWare[]> {
    const selectQuery: string = '$select=Id,Name';

    return this.http.get<ODataValue<IWare>>(`${ApiEndpoints.Wares}?${selectQuery}`)
      .pipe(map((odataValue: ODataValue<IWare>) => odataValue.value));
  }

  public get(id: number): Observable<IWare | undefined> {
    const expandQuery: string = '$expand=Address($expand=Shelf($expand=VerticalSection($expand=Rack))&$expand=Area)';
    const filterQuery: string = `$filter=Id eq ${id}`;

    return this.http.get<ODataValue<IWare>>(`${ApiEndpoints.Wares}?${filterQuery}&${expandQuery}`)
      .pipe(map((odataValue: ODataValue<IWare>) => odataValue.value[0]));
  }

  public create(ware: IWare): Observable<IWare> {
    return this.http.post<IWare>(ApiEndpoints.Wares, ware);
  }

  public delete = (id: number): Observable<void> => 
    this.http.delete<void>(`${ApiEndpoints.Wares}${id}`);
}
