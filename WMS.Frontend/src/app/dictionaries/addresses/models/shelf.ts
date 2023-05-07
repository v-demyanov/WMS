import { IWare } from 'src/app/wares/models/ware';
import { IVerticalSection } from './vertical-section';
import { IProblem } from 'src/app/problems/models/problem';

export interface IShelf {
  Id: number;
  VerticalSectionId: number;
  Index: number;
  InUse: boolean;

  VerticalSection?: IVerticalSection;
  Ware?: IWare;
  Problem?: IProblem;
}