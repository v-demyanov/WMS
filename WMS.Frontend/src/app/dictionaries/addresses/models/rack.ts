import { IArea } from './area';

export interface IRack {
  Id: number;
  AreaId: number;
  Index: number;

  Area?: IArea;
}