import { AddressTreeItemType } from '../enums/address-tree-item-type';

export interface IAddressTreeItem {
  Id: number;
  Type: AddressTreeItemType;
  Name: string;
  InUse: boolean;

  Children?: IAddressTreeItem[];
  Parent?: IAddressTreeItem;
}