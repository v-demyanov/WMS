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
import { WareFilterDescriptor } from '../models/ware-filter-descriptor';
import { WareAdvancedFilterDescriptor } from '../models/ware-advanced-filter-descriptor';

@Injectable({
  providedIn: 'root',
})
export class WaresDataService {

  constructor(private readonly http: HttpClient) { }

  public getAllForNavigation(filterDescriptor?: WareFilterDescriptor): Observable<IWareNavItem[]> {
    const selectQuery: string = '$select=Id,Name,Status';
    const orderQuery: string = '$orderby=Id desc';
    let filterQuery: string = this.prepareFilterQuery(filterDescriptor);
    filterQuery = filterQuery ? '$filter=' + filterQuery : '';

    return this.http.get<ODataValue<IRawWare>>(`${ApiEndpoints.Wares}?${selectQuery}&${orderQuery}&${filterQuery}`)
      .pipe(map((odataValue: ODataValue<IRawWare>) => odataValue.value.map(x => this.parseWareInNavItem(x))));
  }

  public get(id: number): Observable<IWare | undefined> {
    const filterQuery: string = `$filter=Id eq ${id}`;

    return this.http.get<ODataValue<IRawWare>>(`${ApiEndpoints.Wares}?${filterQuery}`)
      .pipe(map((odataValue: ODataValue<IRawWare>) => this.parseWare(odataValue.value[0])));
  }

  public create(ware: IWare): Observable<IWare> {
    return this.http.post<IWare>(ApiEndpoints.Wares, ware);
  }

  public softDelete = (id: number): Observable<void> => 
    this.http.put<void>(`${ApiEndpoints.Wares}${id}/SoftDelete`, null);

  public restore = (id: number, shelfId: number): Observable<void> => 
    this.http.put<void>(`${ApiEndpoints.Wares}${id}/Restore?shelfId=${shelfId}`, null);

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

  private prepareFilterQuery(filterDescriptor?: WareFilterDescriptor): string {
    if (!filterDescriptor) {
      return '';
    }
    const filterOptions: string[] = [];

    if (filterDescriptor.SearchValue) {
      filterOptions.push(`contains(tolower(Name), tolower('${filterDescriptor.SearchValue}'))`);
    }

    if (filterDescriptor.AdvancedFilterDescriptor) {
      const advancedFilterOptions = this.prepareAdvancedFilterOptions(filterDescriptor.AdvancedFilterDescriptor);
      filterOptions.push(...advancedFilterOptions);
    }

    return filterOptions.join(' and ');
  }

  private prepareAdvancedFilterOptions(advancedFilterDescriptor: WareAdvancedFilterDescriptor): string[] {
    const filterOptions: string[] = [];

    if (advancedFilterDescriptor.AreaId) {
      filterOptions.push(`Shelf/VerticalSection/Rack/AreaId eq ${advancedFilterDescriptor.AreaId}`);
    }

    if (advancedFilterDescriptor.RackId) {
      filterOptions.push(`Shelf/VerticalSection/RackId eq ${advancedFilterDescriptor.RackId}`);
    }

    if (advancedFilterDescriptor.ShelfId) {
      filterOptions.push(`Shelf/Id eq ${advancedFilterDescriptor.ShelfId}`);
    }

    if (advancedFilterDescriptor.VerticalSectionId) {
      filterOptions.push(`Shelf/VerticalSectionId eq ${advancedFilterDescriptor.VerticalSectionId}`);
    }

    return filterOptions;
  }
}
