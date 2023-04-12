import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IWare } from '../models/ware';

@Injectable({
  providedIn: 'root',
})
export class WaresEventBusService {

  private itemWasCreatedSource = new Subject<IWare>();

  private itemWasUpdatedSource = new Subject<IWare>();

  private itemWasDeletedSource = new Subject<number>();

  public itemWasCreated$ = this.itemWasCreatedSource.asObservable();

  public itemWasDeleted$ = this.itemWasDeletedSource.asObservable();

  public itemWasUpdated$ = this.itemWasUpdatedSource.asObservable();

  public create = (ware: IWare) => this.itemWasCreatedSource.next(ware);

  public delete = (wareId: number) => this.itemWasDeletedSource.next(wareId);

  public update = (ware: IWare) => this.itemWasUpdatedSource.next(ware);
}