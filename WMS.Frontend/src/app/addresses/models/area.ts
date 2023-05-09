import { IRack } from './rack';

export interface IArea {
  Id: number;
  Name: string;
  MaxVerticalSections: number;
  MaxShelfs: number;

  Racks?: IRack[];
}