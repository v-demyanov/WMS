import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WaresDataService } from './wares-data.service';
import { IWare } from '../models/ware';
import { IWareNavItem } from '../models/ware-nav-item';
import { WareFilterDescriptor } from '../models/ware-filter-descriptor';

@Injectable({
  providedIn: 'root'
})
export class WaresService {

  constructor(private readonly waresDataService: WaresDataService) { }

  public getAllForNavigation = (filterDescriptor?: WareFilterDescriptor): Observable<IWareNavItem[]> => 
    this.waresDataService.getAllForNavigation(filterDescriptor);

  public get = (id: number): Observable<IWare | undefined> => 
    this.waresDataService.get(id);

  public create = (ware: IWare): Observable<IWare> => 
    this.waresDataService.create(ware);

  public softDelete = (id: number): Observable<void> => 
    this.waresDataService.softDelete(id);

  public restore = (id: number, shelfId: number): Observable<void> => 
    this.waresDataService.restore(id, shelfId);

  public update = (id: number, wareUpdateData: IWare) => 
    this.waresDataService.update(id, wareUpdateData);
}
