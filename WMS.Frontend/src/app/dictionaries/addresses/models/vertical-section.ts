import { IRack } from './rack';

export interface IVerticalSection {
  Id: number;
  RackId: number;
  Index: number;

  Rack?: IRack;
}