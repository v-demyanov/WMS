import { IVerticalSection } from './vertical-section';

export interface IShelf {
  Id: number;
  VerticalSectionId: number;
  Index: number;

  VerticalSection?: IVerticalSection;
}