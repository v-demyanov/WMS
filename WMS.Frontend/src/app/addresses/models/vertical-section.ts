import { IRack } from './rack';
import { IShelf } from './shelf';

export interface IVerticalSection {
  Id: number;
  RackId: number;
  Index: number;

  Rack?: IRack;
  Shelfs?: IShelf[];
}