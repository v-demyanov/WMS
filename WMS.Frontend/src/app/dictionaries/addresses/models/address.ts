import { IArea } from './area';
import { IShelf } from './shelf';

export interface IAddress {
  Id: number;
  ShelfId?: number | null;
  AreaId: number;

  Area?: IArea;
  Shelf?: IShelf;
}