import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IShelf } from '../models/shelf';

@Injectable({
  providedIn: 'root'
})
export class ShelfsService {

  constructor(private readonly http: HttpClient) { }

  public getAllByVerticalSectionId(id: number): Observable<IShelf[]> {
    const expandQuery: string = '$expand=Ware,Problem';
    const filterQuery: string = `$filter=VerticalSectionId eq ${id}`;

    return this.http.get<ODataValue<IShelf>>(`${ApiEndpoints.Shelfs}?${expandQuery}&${filterQuery}`)
      .pipe(map((odataValue: ODataValue<IShelf>) => odataValue.value.map(x => this.populateInUseField(x))));
  }

  public getById(id: number): Observable<IShelf> {
    const expandQuery: string = '$expand=Ware,Problem,VerticalSection($expand=Rack($expand=Area))';
    return this.http.get<IShelf>(`${ApiEndpoints.Shelfs}${id}?${expandQuery}`)
      .pipe(map(shelf => this.populateInUseField(shelf)));
  }

  public getNumberOfOccupiedShelves(): Observable<number | undefined> {
    const filterQuery: string = '$filter=(Ware ne null) or (Problem ne null)';
    return this.http.get<ODataValue<IShelf>>(`${ApiEndpoints.Shelfs}?$count=true&$top=0&${filterQuery}`)
      .pipe(map((odataValue: ODataValue<IShelf>) => odataValue['@odata.count']));
  }

  public getNumberOfFreeShelves(): Observable<number | undefined> {
    const filterQuery: string = '$filter=(Ware eq null) and (Problem eq null)';
    return this.http.get<ODataValue<IShelf>>(`${ApiEndpoints.Shelfs}?$count=true&$top=0&${filterQuery}`)
      .pipe(map((odataValue: ODataValue<IShelf>) => odataValue['@odata.count']));
  }

  private populateInUseField(shelf: IShelf): IShelf {
    if (shelf.Problem || shelf.Ware) {
      shelf.InUse = true;
    } else {
      shelf.InUse = false;
    }

    return shelf;
  }
}
