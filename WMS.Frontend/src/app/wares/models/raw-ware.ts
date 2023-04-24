import { IAddress } from 'src/app/dictionaries/addresses/models/address';

export interface IRawWare {
  Id?: number;
  Name?: string;
  Description?: string;
  TechnicalParameterValue?: number;
  UnitOfMeasurementId?: number;
  AddressId?: number;
  IndividualId?: number;
  LegalEntityId?: number;
  ReceivingDate: string;
  ShippingDate?: string | null;

  Address?: IAddress;
}