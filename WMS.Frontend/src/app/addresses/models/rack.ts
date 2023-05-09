import { IArea } from './area';
import { IVerticalSection } from './vertical-section';

export interface IRack {
  Id: number;
  AreaId: number;
  Index: number;

  Area?: IArea;
  VerticalSections?: IVerticalSection[];
}