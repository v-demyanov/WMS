import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { DictinaryItem } from '../models/dictionary-item';
import { ODataValue } from 'src/app/core/models/odata-value';

@Injectable({
  providedIn: 'root',
})
export class DictionariesService {

  constructor(private readonly http: HttpClient) { }

  public getAll(dictionaryName: string): Observable<DictinaryItem[]> {
    const url = `${ environment.apiBaseUrl }/${dictionaryName}`;
    return this.http.get<ODataValue<DictinaryItem>>(url)
      .pipe(map(odataValue => odataValue.value));
  }
}
