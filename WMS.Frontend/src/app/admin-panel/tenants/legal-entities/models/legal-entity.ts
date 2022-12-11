import { TenantType } from '../../enums/tenant-type.enum';

export interface ILegalEntity {
  Id: number;
  Name: string;
  UNN: string;
  Type: TenantType;
  Phone: string;
  Address: string;
}