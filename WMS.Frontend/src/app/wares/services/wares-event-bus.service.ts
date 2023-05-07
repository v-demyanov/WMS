import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IWare } from '../models/ware';
import { WareFilterDescriptor } from '../models/ware-filter-descriptor';

@Injectable({
  providedIn: 'root',
})
export class WaresEventBusService {

  private itemWasCreatedSource = new Subject<IWare>();

  private itemWasUpdatedSource = new Subject<IWare>();

  private itemWasSoftDeletedSource = new Subject<number>();

  private itemWasRestoredSource = new Subject<number>();

  private filterDescriptorWasChangedSource = new Subject<WareFilterDescriptor | undefined>();

  public itemWasCreated$ = this.itemWasCreatedSource.asObservable();

  public itemWasSoftDeleted$ = this.itemWasSoftDeletedSource.asObservable();

  public itemWasRestored$ = this.itemWasRestoredSource.asObservable();

  public itemWasUpdated$ = this.itemWasUpdatedSource.asObservable();

  public filterDescriptorWasChanged$ = this.filterDescriptorWasChangedSource.asObservable();

  public create = (ware: IWare) => this.itemWasCreatedSource.next(ware);

  public softDelete = (wareId: number) => this.itemWasSoftDeletedSource.next(wareId);

  public restore = (wareId: number) => this.itemWasRestoredSource.next(wareId);

  public update = (ware: IWare) => this.itemWasUpdatedSource.next(ware);

  public updateFilterDescriptor = (filterDescriptor: WareFilterDescriptor | undefined) => 
    this.filterDescriptorWasChangedSource.next(filterDescriptor);
}