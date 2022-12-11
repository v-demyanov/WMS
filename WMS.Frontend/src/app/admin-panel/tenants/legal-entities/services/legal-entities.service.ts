import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ILegalEntity } from '../models/legal-entity';
import { LegalEntitiesDataService } from './legal-entities-data.service';

@Injectable({
  providedIn: 'root'
})
export class LegalEntitiesService {

  constructor(private readonly legalEntitiesDataService: LegalEntitiesDataService) { }

  public getAllForSelectionList = (): Observable<ILegalEntity[]> =>
    this.legalEntitiesDataService.getAllForSelectionList();
}
