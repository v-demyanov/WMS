import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WaresToolbarEventBusService {

  private addWareBtnSource = new Subject<void>();

  public addWareBtn$ = this.addWareBtnSource.asObservable();

  public clickOnAddWareBtn = () => this.addWareBtnSource.next();
}