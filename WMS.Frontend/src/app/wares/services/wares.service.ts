import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WaresDataService } from './wares-data.service';
import { IWare } from '../models/ware';

@Injectable({
  providedIn: 'root'
})
export class WaresService {

  constructor(private readonly waresDataService: WaresDataService) { }

  public getAllForNavigation = (): Observable<IWare[]> => this.waresDataService.getAllForNavigation();

  public get = (id: number): Observable<IWare | undefined> => this.waresDataService.get(id);
}
