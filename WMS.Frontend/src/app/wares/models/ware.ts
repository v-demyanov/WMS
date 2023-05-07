import { WareStatus } from '../enums/ware-status.enum';

export interface IWare {
  Id: number;
  Name: string;
  Description?: string;
  ShelfId?: number;
  IndividualId?: number;
  LegalEntityId?: number;
  ReceivingDate: Date;
  ShippingDate?: Date | null;
  Status: WareStatus;
}