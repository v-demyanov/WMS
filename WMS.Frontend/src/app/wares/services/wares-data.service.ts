import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IWare } from '../models/ware';
import { IRawWare } from '../models/raw-ware';
import { parseEnum } from 'src/app/core/helpers/enum.helper';
import { WareStatus } from '../enums/ware-status.enum';
import { IWareNavItem } from '../models/ware-nav-item';
import { IAddress } from 'src/app/dictionaries/addresses/models/address';

@Injectable({
  providedIn: 'root',
})
export class WaresDataService {

  constructor(private readonly http: HttpClient) { }

  public getAllForNavigation(): Observable<IWareNavItem[]> {
    const selectQuery: string = '$select=Id,Name,Status';
    const orderQuery: string = '$orderby=Id desc';

    return this.http.get<ODataValue<IRawWare>>(`${ApiEndpoints.Wares}?${selectQuery}&${orderQuery}`)
      .pipe(map((odataValue: ODataValue<IRawWare>) => odataValue.value.map(x => this.parseWareInNavItem(x))));
  }

  public get(id: number): Observable<IWare | undefined> {
    const expandQuery: string = '$expand=Address($expand=Shelf($expand=VerticalSection($expand=Rack))&$expand=Area)';
    const filterQuery: string = `$filter=Id eq ${id}`;

    return this.http.get<ODataValue<IRawWare>>(`${ApiEndpoints.Wares}?${filterQuery}&${expandQuery}`)
      .pipe(map((odataValue: ODataValue<IRawWare>) => this.parseWare(odataValue.value[0])));
  }

  public create(ware: IWare): Observable<IWare> {
    return this.http.post<IWare>(ApiEndpoints.Wares, ware);
  }

  public softDelete = (id: number): Observable<void> => 
    this.http.put<void>(`${ApiEndpoints.Wares}${id}/SoftDelete`, null);

  public restore = (id: number, address: IAddress): Observable<void> => 
    this.http.put<void>(`${ApiEndpoints.Wares}${id}/Restore`, address);

  public update = (id: number, wareUpdateData: IWare): Observable<void> =>
    this.http.put<void>(`${ApiEndpoints.Wares}${id}`, wareUpdateData);

  private parseWare(rawWare: IRawWare): IWare {
    return {
      ...rawWare,
      ReceivingDate: new Date(rawWare.ReceivingDate),
      ShippingDate: rawWare.ShippingDate ? new Date(rawWare.ShippingDate) : null,
      Status: parseEnum(WareStatus, rawWare.Status),
    }
  }

  private parseWareInNavItem(rawWare: IRawWare): IWareNavItem {
    return {
      Id: rawWare.Id,
      Name: rawWare.Name,
      Status: parseEnum(WareStatus, rawWare.Status),
    };
  }
}
