import { WareStatus } from '../enums/ware-status.enum';

export interface IWareNavItem {
  Id: number;
  Name: string;
  Status: WareStatus;
}
