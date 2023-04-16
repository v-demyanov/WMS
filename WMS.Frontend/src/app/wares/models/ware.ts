import { IAddress } from 'src/app/dictionaries/addresses/models/address';

export interface IWare {
  Id?: number;
  Name?: string;
  Description?: string;
  TechnicalParameterValue?: number;
  UnitOfMeasurementId?: number;
  AddressId?: number;
  IndividualId?: number;
  LegalEntityId?: number;

  Address?: IAddress;
}