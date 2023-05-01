import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

import { SystemSettings } from '../models/system-settings';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';

@Injectable({
  providedIn: 'root',
})
export class SystemSettingsService {

  constructor(private readonly http: HttpClient) { }

  public getAll(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(ApiEndpoints.SystemSettings);
  }

  public update(systemSettings: SystemSettings): Observable<void> {
    return this.http.put<void>(ApiEndpoints.SystemSettings, systemSettings);
  }
}
