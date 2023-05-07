import { WareStatus } from '../enums/ware-status.enum';

export interface IRawWare {
  Id: number;
  Name: string;
  Description?: string;
  ShelfId?: number;
  IndividualId?: number;
  LegalEntityId?: number;
  ReceivingDate: string;
  ShippingDate?: string | null;
  Status: keyof typeof WareStatus;
}